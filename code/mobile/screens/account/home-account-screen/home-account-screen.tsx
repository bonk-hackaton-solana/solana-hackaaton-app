import {useGetStyles} from './home-account-screen.styles'
import {useGetAccountsListInSections} from '@entities/account/libs/hooks/use-get-accounts-list-in-sections'
import {useGetAllMyAccountsQuery} from '@entities/account/model/api/account-api'
import {useMyWalletsList} from '@entities/crypto/model/hooks/use-my-wallets-list'
import {useRequestTokensByWallets} from '@entities/crypto/model/hooks/use-request-tokens-by-wallets'
import {useTokensByAddressList} from '@entities/crypto/model/hooks/use-tokens-by-address-list'
import {cryptoWalletSelectors} from '@entities/crypto/model/slices/crypto-wallets/crypto-wallets-selectors'
import {useFetchExchangeRates} from '@entities/exchange-rates/model/hooks/use-fetch-exchange-rates'
import {useFetchNewsFeed} from '@entities/news/model/hooks/use-fetch-news-feed'
import {HomeTokenLoader} from '@entities/token/ui/home-token-card/home-token-loader'
import {userSelectors} from '@entities/user/api/user-slice'
import {useSelectAccount} from '@features/account/libs/hooks/use-select-account'
import {useFocusEffect} from '@react-navigation/native'
import {VALUES} from '@shared/constants/values'
import {
  RemoteConfigParamsEnum,
  useRemoteConfig
} from '@shared/hooks/use-remote-config'
import {useToggle} from '@shared/hooks/use-toggle'
import {useLocalization} from '@shared/libs/localization/use-localization'
import {useAppSelector} from '@shared/libs/redux/use-app-selector'
import {AppRoutes} from '@shared/navigation/app-routes'
import {HomeAccountScreenProps} from '@shared/navigation/screen-props'
import {homeStyles} from '@shared/styles/home-styles'
import {darkColors} from '@shared/styles/theme-colors'
import {
  KycStatus,
  TransactionInfo,
  TransactionStatus
} from '@shared/types/api/main-api/main-api'
import {CryptoWallet} from '@shared/types/crypto'
import {ButtonDefault} from '@shared/ui/buttons/button-default/button-default'
import {
  ModalConfirmation,
  ModalTypes
} from '@shared/ui/modals/modal-confirmation/modal-confirmation'
import {RefreshControl} from '@shared/ui/refresh-control'
import {AccountPanel} from '@widgets/account/account-panel/account-panel'
import {TokenList} from '@widgets/account/token-list/token-list'
import {TransactionHistory} from '@widgets/account/transaction-history/ui/transaction-history'
import {FC, useCallback, useMemo, useRef, useState} from 'react'
import {Platform, ScrollView, StatusBar} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export const HomeAccountScreen: FC<HomeAccountScreenProps> = ({
  navigation,
  route
}) => {
  const {user} = useAppSelector(userSelectors.selectUser)
  const scrollViewRed = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()
  const {isEnabled} = useRemoteConfig()
  const isCryptoEnabled = isEnabled(RemoteConfigParamsEnum.CRYPTO)

  const {walletsList} = useMyWalletsList()
  const splitWalletsCount = useAppSelector(
    cryptoWalletSelectors.splitWalletsCount
  )

  const contentMarginTop = useMemo(() => {
    if (insets.top > 20) {
      return -100
    }
    return -140
  }, [insets.top])

  useRequestTokensByWallets(walletsList, [splitWalletsCount])

  const selectedWallet = useMemo(() => {
    if (!walletsList.length) return null
    return cryptoWalletSelectors.findWallet(walletsList[0])
  }, [walletsList])

  const walletFromStore = useAppSelector(
    selectedWallet ? selectedWallet : () => ({} as CryptoWallet)
  )

  const wallet = useMemo(
    () => walletFromStore || walletsList[0],
    [walletFromStore, walletsList]
  )
  const hasWallet = useMemo(() => {
    return Object.keys(wallet).length !== 0
  }, [wallet])

  const {shortTokensList, isLoading: isLoadingTokensList} =
    useTokensByAddressList({currentWallet: wallet})

  const {
    value: isSuccessCreateModalVisible,
    on: openSuccessCreateModal,
    off: closeSuccessCreateModal
  } = useToggle()
  const {
    value: isSuccessTopUpModalVisible,
    on: openSuccessTopUpModal,
    off: closeSuccessTopUpModal
  } = useToggle()

  const {t} = useLocalization()
  const screenTexts = t('screens.homeAccount', {returnObjects: true})
  const i18SuccessCreateAccountModal = t('modals.successCreateAccount', {
    returnObjects: true
  })
  const i18SuccessTopUpModal = t('modals.successTopUp', {
    returnObjects: true
  })

  useFetchExchangeRates()
  useFetchNewsFeed()

  const [refreshing, setRefreshing] = useState<boolean>(false)

  const {data: accountsResponse, refetch} = useGetAllMyAccountsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false
    }
  )

  const {accountsList} = useGetAccountsListInSections({
    accounts: accountsResponse,
    options: {
      withTotalAccount: false,
      withFiat: true,
      withCrypto: true
    }
  })
  const {getAccountById} = useSelectAccount(accountsList ?? [])

  const amount = useMemo(() => {
    return getAccountById()?.firstValue?.preview
  }, [getAccountById])

  const {styles, colorScheme} = useGetStyles()

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content')
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(true)
        StatusBar.setBackgroundColor('transparent')
      }

      return () => {
        StatusBar.setBarStyle('light-content')
      }
    }, [])
  )

  useFocusEffect(() => {
    scrollViewRed.current?.scrollTo({x: 0})

    if (user.kycStatus === KycStatus.Pending) {
      navigation.navigate(AppRoutes.VerificationStack, {
        screen: AppRoutes.VerificationPendingKycScreen
      })
    }

    if (user.kycStatus === KycStatus.NotStarted) {
      navigation.navigate(AppRoutes.VerificationStack, {
        screen: AppRoutes.VerificationWelcomeScreen
      })
    }

    if (route.params.isCreateAccountSuccessModalVisible) {
      openSuccessCreateModal()
      navigation.setParams({
        isCreateAccountSuccessModalVisible: false
      })
    }

    if (route.params.isTopUpSuccessModalVisible) {
      openSuccessTopUpModal()
      navigation.setParams({
        isTopUpSuccessModalVisible: false
      })
    }

    if (route.params.shouldRefetchBalance) {
      refetch()
      navigation.setParams({
        shouldRefetchBalance: false
      })
    }
  })

  const handleNavigateToSent = () => {
    navigation.navigate(AppRoutes.SelectSentTypeScreen)
  }

  const onNavigateTransactions = () => {
    navigation.navigate(AppRoutes.AccountTransactionHistoryScreen)
  }

  const onNavigateTransactionDetails = (transaction: TransactionInfo) => {
    navigation.navigate(AppRoutes.AccountTransactionDetailScreen, {
      transaction,
      status: TransactionStatus.Completed
    })
  }

  const onNavigateReceive = () => {
    navigation.navigate(AppRoutes.ReceiveSelectTypeScreen)
  }

  const onNavigateToTopup = () => {
    navigation.navigate(AppRoutes.CryptoWalletStack, {
      screen: AppRoutes.TopupListScreen
    })
  }

  return (
    <>
      <AccountPanel
        amount={amount || VALUES.emptyName}
        onPressHistory={onNavigateTransactions}
        onPressSend={handleNavigateToSent}
        onPressReceive={onNavigateReceive}
        withGradient
        colors={[
          darkColors.app.brandGradient.start,
          darkColors.app.brandGradient.end
        ]}
      />
      <ScrollView
        nestedScrollEnabled
        ref={scrollViewRed}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={homeStyles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true)
              await refetch()
              setRefreshing(false)
            }}
          />
        }>
        {hasWallet && isLoadingTokensList ? (
          <HomeTokenLoader />
        ) : isCryptoEnabled && shortTokensList.length ? (
          <>
            <TokenList tokenList={shortTokensList} />
            <ButtonDefault
              style={styles.topupButton}
              text={screenTexts.topup}
              customTextStyle={styles.topupButtonText}
              onPress={onNavigateToTopup}
            />
          </>
        ) : null}

        <TransactionHistory
          account={getAccountById()}
          onNavigateTransactionDetails={onNavigateTransactionDetails}
        />
      </ScrollView>

      <ModalConfirmation
        colorScheme={colorScheme}
        style={styles.createAccountModal}
        type={ModalTypes.Success}
        title={i18SuccessCreateAccountModal.title}
        desc={i18SuccessCreateAccountModal.description}
        isVisible={isSuccessCreateModalVisible}
        onClose={closeSuccessCreateModal}
      />

      <ModalConfirmation
        colorScheme={colorScheme}
        style={styles.createAccountModal}
        type={ModalTypes.Success}
        title={i18SuccessTopUpModal.title}
        isVisible={isSuccessTopUpModalVisible}
        onClose={closeSuccessTopUpModal}
      />
    </>
  )
}
