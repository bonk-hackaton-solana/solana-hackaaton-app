import {useGetStyles} from './account-transaction-history-screen.styles'
import {useGetAllAccountTransactionsQuery} from '@entities/account/model/api/account-api'
import {TransactionHistoryCard} from '@entities/transactions/ui/transaction-history-card/transaction-history-card'
import {TransactionLoader} from '@entities/transactions/ui/transaction-loader/transaction-loader'
import {TransactionFilters} from '@features/transaction/ui/transaction-filters/transaction-filters'
import {SvgNewFilterIcon} from '@shared/assets/icons/components/new-filter-icon'
import {SvgNewFilterSelectedIcon} from '@shared/assets/icons/components/new-filter-selected-icon'
import {SvgWallet05Icon} from '@shared/assets/icons/components/wallet-05-icon'
import {getThemeColor} from '@shared/helpers/get-theme-color'
import {FilterFormValues} from '@shared/hooks/transaction-filters-provider/transaction-filters-provider'
import usePrevious from '@shared/hooks/use-previous'
import {useLocalization} from '@shared/libs/localization/use-localization'
import {useAppSelector} from '@shared/libs/redux/use-app-selector'
import {AppRoutes} from '@shared/navigation/app-routes'
import {AccountTransactionHistoryScreenProps} from '@shared/navigation/screen-props'
import {themeSelectors} from '@shared/styles/model/theme-slice'
import {
  TransactionStatus,
  TransactionTypes
} from '@shared/types/api/main-api/main-api'
import {TransactionInfo} from '@shared/types/transaction'
import {ButtonDefault} from '@shared/ui/buttons/button-default/button-default'
import {EmptyScreen} from '@shared/ui/empty-screen/empty-screen'
import {MonthsFilterField} from '@shared/ui/forms/months-filter/months-filter-field'
import {YearsFilterField} from '@shared/ui/forms/years-filter/years-filter-field'
import {BaseModal} from '@shared/ui/modals/base-modal/ui'
import {FlashList} from '@shopify/flash-list'
import {DefaultLayout} from '@widgets/layouts/default-layout/default-layout'
import {HistoryList} from '@widgets/transactions/history-list/history-list'
import {useFormatDataToSections} from '@widgets/transactions/history-list/libs/hooks/use-format-data-to-sections'
import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useFormContext} from 'react-hook-form'
import {StyleSheet, TouchableOpacity, View} from 'react-native'

const TRANSACTION_LIST_ITEMS_LIMIT = 500

export const AccountTransactionHistoryScreen: FC<
  AccountTransactionHistoryScreenProps
> = ({navigation}) => {
  const {t} = useLocalization()
  const i18AccountTransactionHistory = t('screens.accountTransactionHistory', {
    returnObjects: true
  })
  const {styles: colorStyles} = useGetStyles()

  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false)

  const colorScheme = useAppSelector(themeSelectors.selectColorScheme)
  const iconColor = getThemeColor({
    colorScheme,
    lightThemeColor: (lightColors) => lightColors.grayscale.grayscale50,
    darkThemeColor: (darkColors) => darkColors.grayscale.grayscale50
  })

  const transactionFilters = Object.values(TransactionTypes)

  const [currentCursor, setCurrentCursor] = useState<string | null>(null)

  const listRef = useRef<null | FlashList<any>>(null)

  const navigateToTransactionDetails = (item: TransactionInfo) => {
    navigation.navigate(AppRoutes.AccountTransactionDetailScreen, {
      transaction: item,
      status: TransactionStatus.Completed
    })
  }

  const {watch, control, reset} = useFormContext<FilterFormValues>()
  const formFilters = watch()

  const prevMonthTimestamp = usePrevious(formFilters.monthTimestamp)
  const prevYearTimestamp = usePrevious(formFilters.yearTimestamp)

  const {
    data: transactionsResponse,
    isFetching,
    error,
    refetch
  } = useGetAllAccountTransactionsQuery(
    {
      cursor: currentCursor,
      limit: 10,
      filters: {
        type: formFilters.types?.length ? formFilters.types : transactionFilters
      },
      pagination: {
        limit: TRANSACTION_LIST_ITEMS_LIMIT,
        offset: 0
      }
    },
    {refetchOnMountOrArgChange: true}
  )

  useEffect(() => {
    refetch()
  }, [formFilters.types])

  // TODO: fix types missmatch
  const {sectionsData} = useFormatDataToSections(
    transactionsResponse?.items ?? []
  )

  const availableSections = useMemo(() => {
    return sectionsData.map((section) => section.title)
  }, [sectionsData])

  useEffect(() => {
    if (
      formFilters &&
      formFilters.monthTimestamp &&
      formFilters.yearTimestamp &&
      prevMonthTimestamp !== formFilters.monthTimestamp
    ) {
      const i18Date = t('common.date', {returnObjects: true})
      const months = Object.values(i18Date.months)

      const sectionItem = sectionsData.find((item) => {
        return item.title.includes(
          months[new Date(formFilters!.monthTimestamp).getMonth()]
        )
      })

      listRef.current?.scrollToItem({
        item: sectionItem?.title,
        viewOffset: -10
      })
    } else if (
      formFilters &&
      formFilters.monthTimestamp &&
      formFilters.yearTimestamp &&
      prevYearTimestamp !== formFilters.yearTimestamp
    ) {
      const sectionItem = sectionsData.find((item) => {
        return item.title.includes(
          new Date(formFilters!.yearTimestamp).getFullYear()
        )
      })

      listRef.current?.scrollToItem({
        item: sectionItem?.title,
        viewOffset: -10
      })
    }
  }, [formFilters])

  const hasData =
    transactionsResponse?.items && transactionsResponse?.items.length > 0

  const handleEndReached = useCallback(() => {
    if (transactionsResponse?.cursor && transactionsResponse.hasNextCursor) {
      setCurrentCursor(transactionsResponse.cursor)
    }
  }, [transactionsResponse])

  const [activeTabTimestamp, setActiveTabTimestamp] = useState<
    number | null | undefined
  >(null)
  const [activeYearTabTimestamp, setActiveYearTabTimestamp] = useState<
    number | null | undefined
  >(null)

  const isManual = useRef(false)

  const handleSetIsManual = useCallback(
    () => (isManual.current = !isManual.current),
    [isManual.current]
  )

  const handleFocusDate = useCallback(
    (monthTimeStamp: number, yearTimeStamp: number) => {
      if (isManual.current) {
        setActiveYearTabTimestamp(yearTimeStamp)
        setActiveTabTimestamp(monthTimeStamp)
      }
    },
    [isManual]
  )

  const handleResetActiveTab = useCallback(
    () => setActiveTabTimestamp(null),
    []
  )

  const handleResetActiveYearTab = useCallback(
    () => setActiveYearTabTimestamp(null),
    []
  )

  const onBack = () => {
    navigation.goBack()
    reset()
  }

  const renderFilterButton = useCallback(() => {
    if (formFilters.types.length) {
      return (
        <TouchableOpacity onPress={() => setShowFiltersModal(true)}>
          <SvgNewFilterSelectedIcon color={iconColor} />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity onPress={() => setShowFiltersModal(true)}>
        <SvgNewFilterIcon color={iconColor} />
      </TouchableOpacity>
    )
  }, [iconColor, formFilters.types.length])

  const handleApplyFilters = () => {
    refetch()
    setShowFiltersModal(false)
  }

  const handleRemoveFilters = () => {
    setShowFiltersModal(false)
  }

  const getContent = useCallback(() => {
    if (isFetching) {
      return (
        <View style={styles.loaderContainer}>
          <TransactionLoader />
        </View>
      )
    }

    if (hasData) {
      return (
        <HistoryList
          ref={listRef}
          // @ts-ignore
          data={transactionsResponse?.items}
          ItemComponent={TransactionHistoryCard}
          onItemPress={navigateToTransactionDetails}
          onEndReached={handleEndReached}
          onFocusDate={handleFocusDate}
          onSetManualScroll={handleSetIsManual}
        />
      )
    }

    return (
      <EmptyScreen
        IconComponent={<SvgWallet05Icon />}
        text={i18AccountTransactionHistory.emptyStateText}
      />
    )
  }, [isFetching, hasData, transactionsResponse?.items])

  const handleGeneratePDF = useCallback(() => {
    navigation.navigate(AppRoutes.AccountStatementScreen, {
      formFilters: formFilters
    })
  }, [])

  return (
    <>
      <DefaultLayout>
        <DefaultLayout.NestedHeader
          title={i18AccountTransactionHistory.title}
          onBackButtonPress={onBack}
          customRight={renderFilterButton()}
        />
        <View style={styles.mainContent}>
          <View style={styles.transactionsContent}>
            <YearsFilterField
              control={control}
              name="yearTimestamp"
              availableYears={availableSections}
              activeTabTimestamp={activeYearTabTimestamp}
              resetActiveTab={handleResetActiveYearTab}
            />

            <MonthsFilterField
              control={control}
              name="monthTimestamp"
              selectedYear={formFilters.yearTimestamp}
              availableMonths={availableSections}
              activeTabTimestamp={activeTabTimestamp}
              activeYearTabTimestamp={activeYearTabTimestamp}
              resetActiveTab={handleResetActiveTab}
            />

            {getContent()}
          </View>
          <ButtonDefault
            onPress={handleGeneratePDF}
            style={colorStyles.button}
            text={i18AccountTransactionHistory.generatePDF}
          />
        </View>
      </DefaultLayout>

      <BaseModal
        style={{borderBottomRightRadius: 0}}
        colorScheme={colorScheme}
        isVisible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}>
        <TransactionFilters
          filters={transactionFilters}
          onApplyFilters={handleApplyFilters}
          onRemoveFilters={handleRemoveFilters}
        />
      </BaseModal>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16
  },
  loaderContainer: {
    marginTop: 20
  },
  mainContent: {
    flex: 1
  },
  transactionsContent: {
    flex: 1,
    marginBottom: 20
  }
})
