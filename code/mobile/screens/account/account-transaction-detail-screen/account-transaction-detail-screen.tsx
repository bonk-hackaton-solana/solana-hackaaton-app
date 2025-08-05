import {useGetColors} from './account-transaction-details-screen.styles'
import {userSelectors} from '@entities/user/api/user-slice'
import {useHtmlTransactionDetails} from '@features/pdf-generator/model/html-transaction-details/use-html-transaction-details'
import {PdfGenerator} from '@features/pdf-generator/pdf-generator'
import {SvgReceiveIcon} from '@shared/assets/icons/components/receive-icon'
import {DATE_FORMATS} from '@shared/constants/date'
import {TYPOGRAPHY} from '@shared/constants/typography'
import {useLocalization} from '@shared/libs/localization/use-localization'
import {useAppSelector} from '@shared/libs/redux/use-app-selector'
import {AccountTransactionDetailScreenProps} from '@shared/navigation/screen-props'
import {currencyUtilities} from '@shared/services/currency-untilities'
import {dateUtilities} from '@shared/services/date-utilities'
import {transactionUtilities} from '@shared/services/transaction-utilities'
import {
  TransactionStatus,
  TransactionTypes
} from '@shared/types/api/main-api/main-api'
import {DetailItem} from '@shared/ui/information/detail-item/detail-item'
import {TagDefault} from '@shared/ui/tags/tag-default/tag-default'
import {DefaultLayout} from '@widgets/layouts/default-layout/default-layout'
import {MerchantDetailsCard} from '@widgets/transactions/merchant-details-card/merchant-details-card'
import {FC} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'

export const AccountTransactionDetailScreen: FC<
  AccountTransactionDetailScreenProps
> = ({route, navigation}) => {
  const {t} = useLocalization()
  const i18AccountTransactionDetails = t('screens.accountTransactionDetails', {
    returnObjects: true
  })
  const i18DownloadButton = t('ui.buttons.download', {returnObjects: true})
  const i18TransactionStatus = t('ui.status', {returnObjects: true})
  const i18TransactionType = t('ui.transactionType', {returnObjects: true})

  const {styles: colorsStyles} = useGetColors()
  const {user} = useAppSelector(userSelectors.selectUser)

  const {transaction} = route.params
  const {htmlTransactionDetails, fileNameTransactionDetails} =
    useHtmlTransactionDetails({
      transactionDetails: transaction,
      user
    })

  const onBack = () => {
    navigation.goBack()
  }

  const getTag = () => {
    const transactionStatus =
      transaction.status.charAt(0).toUpperCase() +
      transaction.status.slice(1).split('').join('')

    switch (transactionStatus) {
      case TransactionStatus.Completed:
        return (
          <TagDefault
            text={i18TransactionStatus.completed}
            color="green"
            size="small"
          />
        )
      case TransactionStatus.Cleared:
        return (
          <TagDefault
            text={i18TransactionStatus.completed}
            color="green"
            size="small"
          />
        )
      case TransactionStatus.Authorized:
        return (
          <TagDefault
            text={i18TransactionStatus.completed}
            color="green"
            size="small"
          />
        )
      case TransactionStatus.Declined:
        return (
          <TagDefault
            text={i18TransactionStatus.declined}
            color="red"
            size="small"
          />
        )
    }
  }

  const getType = () => {
    switch (transaction.type) {
      case TransactionTypes.FUNDING:
        return i18TransactionType.funding
      case TransactionTypes.PURCHASE:
        return i18TransactionType.purchase
      case TransactionTypes.TOP_UP:
        return i18TransactionType.topUp
      case TransactionTypes.PAYMENT:
        return i18TransactionType.transfer
      case TransactionTypes.OUTGOING_TRANSFER:
        return i18TransactionType.outgoingTransfer
    }
  }

  const getRecipientDetails = () => {
    if (
      transaction.direction === 'sent' &&
      (transaction?.contrahent || transaction.receiverName) &&
      !transaction?.merchant
    ) {
      return (
        <DetailItem
          style={styles.detailItem}
          title={i18AccountTransactionDetails.sentTo}
          value={transaction?.receiverName || transaction?.contrahent?.name}
        />
      )
    }
    if (
      transaction.direction === 'received' &&
      (transaction.senderName || transaction?.contrahent?.name)
    ) {
      return (
        <DetailItem
          style={styles.detailItem}
          title={i18AccountTransactionDetails.receivedFrom}
          value={transaction?.senderName || transaction?.contrahent?.name}
        />
      )
    }
    return null
  }

  return (
    <DefaultLayout
      withGradientOnDarkTheme={false}
      customStyles={colorsStyles.root}>
      <DefaultLayout.NestedHeader
        title={i18AccountTransactionDetails.title}
        onBackButtonPress={onBack}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {transaction?.merchant ? (
          <View style={[styles.detailsWrapper, colorsStyles.detailsWrapper]}>
            <MerchantDetailsCard merchant={transaction?.merchant} />
          </View>
        ) : null}

        <View style={[styles.detailsWrapper, colorsStyles.detailsWrapper]}>
          <DetailItem
            style={styles.detailItem}
            title={i18AccountTransactionDetails.status}
            ValueComponent={getTag()}
          />

          {transaction?.card ? (
            <DetailItem
              style={styles.detailItem}
              title={i18AccountTransactionDetails.card}
              value={
                `**** ${transaction?.card?.cardNumber.slice(12)}` || getType()
              }
            />
          ) : null}

          <DetailItem
            title={i18AccountTransactionDetails.category}
            value={transaction?.merchant?.category || getType()}
          />
        </View>

        <View style={[styles.detailsWrapper, colorsStyles.detailsWrapper]}>
          {getRecipientDetails()}

          {transaction?.currency ? (
            <DetailItem
              style={styles.detailItem}
              title={i18AccountTransactionDetails.currency}
              value={transaction.currency}
            />
          ) : null}

          {transaction?.note ? (
            <DetailItem
              style={styles.detailItem}
              title={i18AccountTransactionDetails.note}
              value={transaction.note}
            />
          ) : null}

          {transaction?.contrahent?.iban ? (
            <DetailItem
              style={styles.detailItem}
              title={i18AccountTransactionDetails.iban}
              value={transaction.contrahent.iban
                .replace(/\s+/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim()}
              valueStyle={colorsStyles.value}
            />
          ) : null}

          <DetailItem
            title={i18AccountTransactionDetails.amount}
            value={transactionUtilities.formatTransactionValueByType(
              currencyUtilities.formatValueWithCurrencyPrefix(
                Math.abs(transaction.amount).toString(),
                transaction.currency
              ),
              transaction.type,
              true,
              transaction.direction
            )}
          />
        </View>

        <View style={[styles.detailsWrapper, colorsStyles.detailsWrapper]}>
          <DetailItem
            style={styles.detailItem}
            title={i18AccountTransactionDetails.date}
            value={dateUtilities.format(
              transaction.createdAt,
              DATE_FORMATS.prettyDateWithoutTime
            )}
          />
          <DetailItem
            style={styles.detailItem}
            title={i18AccountTransactionDetails.time}
            value={dateUtilities.format(
              transaction.createdAt,
              DATE_FORMATS.time
            )}
          />
          <DetailItem
            title={i18AccountTransactionDetails.receipt}
            ValueComponent={
              <PdfGenerator
                html={htmlTransactionDetails}
                fileName={fileNameTransactionDetails}
                buttonAsText
                buttonIcon={(props) => (
                  <SvgReceiveIcon
                    color={props.color}
                    width={20}
                    height={20}
                    style={{marginRight: 6}}
                  />
                )}
                buttonText={i18DownloadButton}
                textStyle={{...TYPOGRAPHY.body2Bold14}}
              />
            }
          />
        </View>
      </ScrollView>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 12
  },
  title: {
    ...TYPOGRAPHY.headline1Bold18
  },
  detailsWrapper: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  detailItem: {
    marginBottom: 16
  },
  noteDetailItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  noteTitleStyle: {
    marginBottom: 8
  },
  noteValueStyle: {
    maxWidth: '100%',
    textAlign: 'left'
  }
})
