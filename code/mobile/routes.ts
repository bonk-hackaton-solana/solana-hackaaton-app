export enum AppRoutes {
    // root-stack
    AppStack = 'AppStack',
    UpdateAppScreen = 'UpdateAppScreen',

    //  auth-stack
    AuthStack = 'AuthStack',
    SignInScreen = 'SignInScreen',
    SignInCodeVerificationScreen = 'SignInCodeVerificationScreen',
    SignUpScreen = 'SignUpScreen',
    SignUpCodeVerificationScreen = 'SignUpCodeVerificationScreen',
    SignUpPinSettingsScreen = 'SignUpPinSettingsScreen',
    SignInPinSettingsScreen = 'SignInPinSettingsScreen',
    AuthPdfScreen = 'AuthPdfScreen',
    AuthOnboardingScreen = 'AuthOnboardingScreen',
    PersonalDetailsStack = 'PersonalDetailsStack',
    UserNameScreen = 'UserNameScreen',
    CountryScreen = 'CountryScreen',
    UserAddressScreen = 'UserAddressScreen',

    // user-details-stack
    UserDetailsStack = 'UserDetailsStack',

    // verification-stack
    VerificationStack = 'VerificationStack',
    VerificationWelcomeScreen = 'VerificationWelcomeScreen',
    VerificationKycScreen = 'VerificationKycScreen',
    VerificationPendingKycScreen = 'VerificationPendingKycScreen',
    VerificationFailedKycScreen = 'VerificationFailedKycScreen',
    VerificationRestrictedKycScreen = 'VerificationRestrictedKycScreen',

    // main-stack
    MainStack = 'MainStack',
    PinCodeScreen = 'PinCodeScreen',
    ResetPinScreen = 'ResetPinScreen',
    RecoverPinEmailCodeVerificationScreen = 'RecoverPinEmailCodeVerificationScreen',
    QRScannerScreenModal = 'QRScannerScreenModal',
    NewsListScreen = 'NewsListScreen',
    TopUpScreen = 'TopUpScreen',
    CryptoWalletEmptyScreen = 'CryptoWalletEmptyScreen',
    SearchListScreen = 'SearchListScreen',

    // home-top-tab-stack
    BottomTab = 'BottomTab',
    HomeAccountScreen = 'HomeAccountScreen',
    HomeCryptoWalletScreen = 'HomeCryptoWalletScreen',
    HomeCardsScreen = 'HomeCardsScreen',

    // profile-stack
    ProfileGroup = 'ProfileGroup',
    ProfileScreen = 'ProfileScreen',
    ProfileChangePinScreen = 'ProfileChangePinScreen',
    PrivacyAndSecurityScreen = 'PrivacyAndSecurityScreen',
    ProfileLegalInformationScreen = 'ProfileLegalInformationScreen',
    ProfilePdfScreen = 'ProfilePdfScreen',
    ProfileAppLanguageScreen = 'ProfileAppLanguageScreen',

    // send-stack
    SendGroup = 'SendGroup',
    SelectMultiChainTokenScreen = 'SelectMultiChainTokenScreen',
    SendSelectRecipientScreen = 'SendSelectRecipientScreen',
    SendSpecifyAmountScreen = 'SendSpecifyAmountScreen',
    TransactionVerificationScreen = 'TransactionVerificationScreen',
    TransactionSummaryScreen = 'TransactionSummaryScreen',
    SelectSentTypeScreen = 'SelectSentTypeScreen',
    SendBankTransferScreen = 'SendBankTransferScreen',
    BankTransferVerificationScreen = 'BankTransferVerificationScreen',
    BankTransferDetailsScreen = 'BankTransferDetailsScreen',

    // receive-stack
    ReceiveGroup = 'ReceiveGroup',
    ReceiveSelectWallet = 'ReceiveSelectWallet',
    ReceiveSelectToken = 'ReceiveSelectToken',
    ReceiveMyAddressScreen = 'ReceiveMyAddressScreen',
    ReceiveSelectTypeScreen = 'ReceiveSelectTypeScreen',
    ReceiveIbanScreen = 'ReceiveIbanScreen',

    // wallet-connect-stack
    WalletConnectStack = 'WalletConnectStack',
    WalletConnectScreen = 'WalletConnectScreen',
    WalletConnectProposalScreen = 'WalletConnectProposalScreen',
    WalletConnectRequestScreen = 'WalletConnectRequestScreen',
    WalletConnectDetailsScreen = 'WalletConnectDetailsScreen',

    //tokens-stack
    TokenGroup = 'TokenGroup',
    TokensListScreen = 'TokensListScreen',

    // crypto-wallet-stack
    CryptoWalletStack = 'CryptoWalletStack',
    CryptoWalletDetailsScreen = 'CryptoWalletDetailsScreen',
    CryptoWalletTransactionsHistoryScreen = 'CryptoWalletTransactionsHistoryScreen',
    CryptoWalletImportSelectScreen = 'CryptoWalletImportSelectScreen',
    CryptoWalletImportScreen = 'CryptoWalletImportScreen',
    CryptoWalletCreateSelectScreen = 'CryptoWalletCreateSelectScreen',
    CryptoWalletTransactionDetailsScreen = 'CryptoWalletTransactionDetailsScreen',
    SeedPhraseVerificationScreen = 'SeedPhraseVerificationScreen',
    DeleteWalletVerificationScreen = 'DeleteWalletVerificationScreen',
    TopupListScreen = 'TopupListScreen',

    // seed-phrase-stack
    BackupWalletGroup = 'BackupWalletGroup',
    BackUpWalletSeedPhraseScreen = 'BackUpWalletSeedPhraseScreen',
    BackUpWalletSeedPhraseConfirmScreen = 'BackUpWalletSeedPhraseConfirmScreen',

    // create wallet stack
    CreateWalletGroup = 'CreateWalletGroup',
    CreateWalletSeedPhraseScreen = 'CreateWalletSeedPhraseScreen',
    CreateWalletSeedPhraseConfirmScreen = 'CreateWalletSeedPhraseConfirmScreen',

    // cards-stack
    CardsGroup = 'CardsGroup',
    CardTransactionsHistoryScreen = 'CardTransactionsHistoryScreen',
    CardTransactionDetailsScreen = 'CardTransactionDetailsScreen',
    CardScreen = 'CardScreen',
    CardSettingsLimitScreen = 'CardSettingsLimitScreen',
    AddDebitCardScreen = 'AddDebitCardScreen',
    AddVirtualCardScreen = 'AddVirtualCardScreen',
    CardSettingsScreen = 'CardSettingsScreen',

    // account-stack
    AccountGroup = 'AccountGroup',
    AccountStatementScreen = 'AccountStatementScreen',
    AccountTransactionHistoryScreen = 'AccountTransactionHistoryScreen',
    AccountTransactionDetailScreen = 'AccountTransactionDetailScreen'
}
