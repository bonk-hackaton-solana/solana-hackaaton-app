import { Id, BadRequestError, ServerError } from 'common';
import { Card, CardStyle } from '../models/Card';
import { CardStatusEnum, CardTypeEnum, CardProviderStatusEnum } from '../types/enums';
import { CardDTO, SafeCardDetails } from '../types/dto';
import { CardLimitInput, CardLimitsResponse, CardFreezeResponse, CardUnfreezeResponse, CardDeleteResponse } from '../types/api';
import { ICardProviderService } from './providers/ICardProviderService';

export class CardsService {
    constructor(private readonly cardProvider: ICardProviderService) {}

    public createVirtualCard = async (userId: Id, name: string, style: CardStyle): Promise<CardDTO> => {
        return await this.cardProvider.createVirtualCard(userId, name, style);
    };

    public createPhysicalCard = async (userId: Id): Promise<CardDTO> => {
        return await this.cardProvider.createPhysicalCard(userId);
    };

    public addCardLimits = async (userId: Id, cardId: number, limits: CardLimitInput): Promise<void> => {
        await this.cardProvider.addCardLimits(userId, cardId, limits);
    };

    public getCardLimits = async (userId: Id, cardId: number): Promise<CardLimitsResponse> => {
        return await this.cardProvider.getCardLimits(userId, cardId);
    };

    public updateCardLimits = async (userId: Id, cardId: number, limitId: string, limits: CardLimitInput): Promise<void> => {
        await this.cardProvider.updateCardLimits(userId, cardId, limitId, limits);
    };

    public deleteCardLimits = async (userId: Id, cardId: number, limitId: string): Promise<void> => {
        await this.cardProvider.deleteCardLimits(userId, cardId, limitId);
    };

    public changeCardPin = async (userId: Id, cardId: number, pin: string): Promise<void> => {
        await this.cardProvider.changeCardPin(userId, cardId, pin);
    };

    public activateCard = async (userId: Id, cardId: number): Promise<void> => {
        await this.cardProvider.activateCard(userId, cardId);
    };

    public syncUserCardsToDatabase = async (userId: Id): Promise<SafeCardDetails[]> => {
        const storedCards = await Card.findAll({ where: { userId } });
        const providerCards = await this.cardProvider.getUserCards(userId);

        const newCards = providerCards.filter(
            c => !storedCards.find(sc => sc.providerCardId === `${c.id}`)
        );

        const removedCards = storedCards.filter(
            sc => !providerCards.find(c => `${c.id}` === sc.providerCardId)
        );

        const updatedCards = providerCards.filter(
            c => storedCards.find(sc => sc.providerCardId === `${c.id}`)
        );

        for (const card of newCards) {
            await Card.createWithoutId({
                userId,
                type: card.type.toLowerCase() as CardTypeEnum,
                cardNumber: card.cardNumber,
                expirationDate: card.expirationDate,
                status: (card.status?.toLowerCase() as CardStatusEnum) || CardStatusEnum.PENDING,
