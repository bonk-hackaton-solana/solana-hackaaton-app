import { BadRequestError, Id } from 'common';
import { Transaction, Transfer, User } from '../models';
import { TransactionDTO } from '../types';
import { PaginationRequest, SortRequest, FilterRequest } from '../types/api';
import { TransactionProviderApi } from '../providers/TransactionProviderApi';
import { CacheService, LoggerService, NotificationService, AnalyticsService } from '../services';
import { mapFilters, mapTransactionType, getDirection, formatAmount } from '../utils';
import { v4 } from 'uuid';

export class TransactionService {
    constructor(
        private readonly transactionProvider: TransactionProviderApi,
        private readonly notificationService: NotificationService,
        private readonly cacheService: CacheService
    ) {}

    public getUserTransactions = async (
        userId: Id,
        request: {
            pagination: PaginationRequest;
            sort?: SortRequest;
            filters?: FilterRequest;
        }
    ) => {
        const user = await User.findByPk(userId);
        if (!user?.externalId) {
            throw new BadRequestError('User is not registered');
        }

        const sortOrder: [string, string][] = (request.sort?.fields || []).map(field => [
            field,
            request.sort?.order || 'ASC',
        ]);

        const filters = mapFilters(user.id, request.filters);

        if (process.env.FALLBACK_FETCH_ENABLED !== 'true') {
            await this.fetchFromProviderIfNeeded(user);
        }

        const transactions = await Transaction.findAll({
            where: filters,
            limit: request.pagination.limit || 100,
            offset: request.pagination.offset || 0,
            include: ['relatedEntities'],
            order: sortOrder,
        });

        const count = await Transaction.count({ where: filters });

        const mapped = await Promise.all(
            transactions.map(async (tx) => {
                const data = tx.get({ plain: true });

                const senderName = tx.sender
                    ? `${tx.sender.firstName} ${tx.sender.lastName}`
                    : null;
                const receiverName = tx.receiver
                    ? `${tx.receiver.firstName} ${tx.receiver.lastName}`
                    : null;

                delete data.sender;
                delete data.receiver;
                delete data.card;

                return {
                    ...data,
                    amount: formatAmount(data.amount),
                    senderName,
                    receiverName,
                    card: tx.card
                        ? {
                            id: tx.card.id,
                            name: tx.card.name,
                            cardNumber: tx.card.cardNumber,
                        }
                        : null,
                } as TransactionDTO;
            })
        );

        mapped.forEach(t => {
            const created = t.createdAt;
            t.createdAt = t.providerCreatedAt || t.createdAt;
            t.providerCreatedAt = created;
        });

        return {
            totalItems: count,
            items: mapped,
        };
    };

    private fetchFromProviderIfNeeded = async (user: User) => {
        const providerTransactions = await this.transactionProvider.getUserTransactions({
            userId: user.externalId,
            limit: 100,
        });

        let providerIds = providerTransactions.content
            .map(tx => tx?.id?.toString())
            .filter(Boolean);

        const existing = await Transaction.findAll({
            attributes: ['providerTransactionId'],
            where: { providerTransactionId: providerIds },
        });

        const existingIds = existing.map(tx => tx.providerTransactionId);
        const missingIds = providerIds.filter(id => !existingIds.includes(id));

        for (const id of missingIds) {
            await this.handleIncomingTransaction(id);
        }
    };

    public handleIncomingTransaction = async (
        providerTransactionId: string,
        externalUserId?: string
    ) => {
        const transaction = await this.transactionProvider.getTransactionById(
            providerTransactionId,
            externalUserId
        );

        if (!transaction) {
            LoggerService.info(`Transaction ${providerTransactionId} not found from provider.`);
            return;
        }

        const internalUserId = await this.resolveInternalUserId(transaction.userId, providerTransactionId);

        await this.cacheService.invalidateUserCache(internalUserId, ['transactions', 'balances']);

        const wasUpdated = await this.saveTransaction(transaction, internalUserId);

        await AnalyticsService.track('transaction', 'create', internalUserId, {
            type: transaction.type,
            status: transaction.status,
            amount: transaction.amountMinor,
            currency: transaction.currency,
        });

        if (wasUpdated) {
            await this.notificationService.notifyUser(
                internalUserId,
                transaction.type
            );
        }
    };

    private saveTransaction = async (providerData: any, userId: Id): Promise<boolean> => {
        const existing = await this.findInternalTransaction(
            providerData.id.toString(),
            providerData.clientTransactionId
        );

        const formattedAmount = formatAmount(providerData.amountMinor, providerData.type);
        const direction = getDirection(providerData.type);
        const description = this.generateDescription(providerData, userId);

        if (existing) {
            existing.amount = formattedAmount;
            existing.status = providerData.status;
            existing.description = description;
            existing.direction = direction;
            // ... update other fields as needed

            if (existing.changed()) {
                await existing.save();
                LoggerService.info(`Transaction ${existing.id} updated.`);
                return true;
            }
            return false;
        } else {
            const newId = providerData.clientTransactionId || v4();
            await Transaction.create({
                id: newId,
                userId,
                amount: formattedAmount,
                status: providerData.status,
                direction,
                description,
                providerTransactionId: providerData.id.toString(),
                // ... set other fields as needed
            });

            LoggerService.info(`Transaction ${newId} created.`);
            return true;
        }
    };

    private findInternalTransaction = async (
        providerTransactionId: string,
        clientTransactionId: string
    ): Promise<Transaction | null> => {
        return (
            (await Transaction.findOne({
                where: { providerTransactionId },
            })) || (await Transaction.findByPk(clientTransactionId))
        );
    };

    private generateDescription = (providerData: any, userId: Id): string => {
        if (providerData.isInternalTransfer) {
            return `Transfer ${userId === providerData.senderId ? 'to' : 'from'} ${
                providerData.counterpartyName
            }`;
        }

        switch (providerData.type) {
            case 'TOP_UP':
                return 'Top up';
            default:
                return providerData.description || 'Transaction';
        }
    };

    private resolveInternalUserId = async (
        externalUserId: string,
        transactionId: string
    ): Promise<Id> => {
        const user = await User.findOne({
            where: { externalId: externalUserId },
        });

        if (!user) {
            LoggerService.error(`User not found for transaction ${transactionId}`);
            throw new Error(`Invalid user for transaction ${transactionId}`);
        }

        return user.id;
    };
}
