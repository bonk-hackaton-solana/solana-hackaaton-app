import {useGetStyles} from './account-statement-screen.styles'
import {useGetAccountOperations} from './libs/hooks/use-get-account-operations'
import {useHtmlPeriod} from '@features/pdf-generator/model/html-period/html-period'
import {PdfGenerator} from '@features/pdf-generator/pdf-generator'
import {TransactionFilters} from '@features/transaction/ui/transaction-filters/transaction-filters'
import {SvgNewFilterIcon} from '@shared/assets/icons/components/new-filter-icon'
import {SvgNewFilterSelectedIcon} from '@shared/assets/icons/components/new-filter-selected-icon'
import {SvgReceiveIcon} from '@shared/assets/icons/components/receive-icon'
import {DATE_FORMATS} from '@shared/constants/date'
import {getThemeColor} from '@shared/helpers/get-theme-color'
import {FilterFormValues} from '@shared/hooks/transaction-filters-provider/transaction-filters-provider'
import {useLocalization} from '@shared/libs/localization/use-localization'
import {AccountStatementScreenProps} from '@shared/navigation/screen-props'
import {dateUtilities} from '@shared/services/date-utilities'
import {
  AccountOperation,
  TransactionTypes
} from '@shared/types/api/main-api/main-api'
import {DateRange} from '@shared/ui/forms/date-range-picker/date-range-picker'
import {DateRangePickerField} from '@shared/ui/forms/date-range-picker/date-range-picker-field'
import {TransactionFilterItem} from '@shared/ui/forms/transaction-filter/transaction-filter-item'
import {BaseModal} from '@shared/ui/modals/base-modal/ui'
import {DefaultLayout} from '@widgets/layouts/default-layout/default-layout'
import {FC, useCallback, useEffect, useMemo, useState} from 'react'
import {useController, useForm, useFormContext} from 'react-hook-form'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

type FormType = {
  datesRange: DateRange
}

export const AccountStatementScreen: FC<AccountStatementScreenProps> = ({
  navigation
}) => {
  const {styles: colorStyles, colorScheme} = useGetStyles()
  const {t} = useLocalization()
  const i18AccountStatement = t('screens.accountStatement', {
    returnObjects: true
  })

  const transactionFilters = Object.values(TransactionTypes)

  const {watch: watchFilters, control: filtersControl} =
    useFormContext<FilterFormValues>()
  const formFilters = watchFilters()
  const {field} = useController({control: filtersControl, name: 'types'})

  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false)

  const iconColor = getThemeColor({
    colorScheme,
    lightThemeColor: (lightColors) => lightColors.grayscale.grayscale50,
    darkThemeColor: (darkColors) => darkColors.grayscale.grayscale50
  })

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

  const {
    control,
    watch,
    formState: {isValid}
  } = useForm<FormType>({
    mode: 'all',
    defaultValues: {
      datesRange: {
        from: new Date(),
        to: new Date()
      }
    }
  })

  const {operations, fetchOperations} = useGetAccountOperations()
  const {from, to} = watch().datesRange

  const filteredOperations = useMemo(() => {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    return operations
      .filter((op) => {
        const withinRange =
          new Date(op.createdAt) >= fromDate && new Date(op.createdAt) <= toDate
        const matchingType =
          formFilters.types.length === 0 || formFilters.types.includes(op.type)
        return withinRange && matchingType
      })
      .map((op) => {
        return {
          createdAt: op.createdAt,
          operationType: op.direction === 'received' ? 'Incoming' : 'Outgoing',
          quantity: Math.abs(op.amount).toString(),
          unit: op.currency,
          direction: op.direction
        } as AccountOperation
      })
  }, [from, to, operations, formFilters.types])

  useEffect(() => {
    fetchOperations()
  }, [])

  const {fileNamePeriod, htmlPeriod} = useHtmlPeriod({
    period: filteredOperations,
    date: `${dateUtilities.format(
      from,
      DATE_FORMATS.prettyDateWithoutTime
    )} - ${dateUtilities.format(to, DATE_FORMATS.prettyDateWithoutTime)}`
  })

  const handleBackPress = () => {
    navigation.goBack()
  }

  const renderButtonIcon = useCallback(() => {
    return <SvgReceiveIcon color={iconColor} />
  }, [iconColor])

  const handleApplyFilters = () => {
    setShowFiltersModal(false)
  }

  const handleRemoveFilters = () => {
    setShowFiltersModal(false)
  }

  const handleChange = (filter: string) => {
    const temp = formFilters.types.includes(filter)
      ? formFilters.types.filter((item) => item !== filter)
      : [...formFilters.types, filter]
    field.onChange(temp)
  }

  const isAllSelected = useMemo(() => {
    if (transactionFilters.length !== formFilters.types.length) return false
    return [...transactionFilters]
      .sort()
      .every((value, index) => value === [...formFilters.types].sort()[index])
  }, [formFilters.types])

  return (
    <DefaultLayout>
      <DefaultLayout.NestedHeader
        title={i18AccountStatement.title}
        onBackButtonPress={handleBackPress}
        customRight={renderFilterButton()}
      />
      <View style={styles.formWrapper}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={colorStyles.title}>{i18AccountStatement.filters}</Text>
          <View style={styles.filtersContainer}>
            <TransactionFilterItem
              title={i18AccountStatement.all}
              isSelected={isAllSelected}
              onPress={() => {
                if (!isAllSelected) {
                  field.onChange(transactionFilters)
                } else {
                  field.onChange([])
                }
              }}
            />
            {transactionFilters.map((filter) => {
              const isSelected = formFilters.types.includes(filter)
              return (
                <TransactionFilterItem
                  title={filter}
                  isSelected={isSelected}
                  onPress={() => handleChange(filter)}
                />
              )
            })}
          </View>
          <Text style={colorStyles.title}>
            {i18AccountStatement.selectDate}
          </Text>
          <Text style={colorStyles.caption}>
            {i18AccountStatement.chooseATimeRange}
          </Text>
          <DateRangePickerField control={control} name="datesRange" />
        </ScrollView>
        <PdfGenerator
          isDisable={!isValid}
          html={htmlPeriod}
          fileName={fileNamePeriod}
          buttonText={i18AccountStatement.downloadPdf}
          style={colorStyles.button}
          buttonRightIcon={renderButtonIcon}
        />
      </View>

      <BaseModal
        colorScheme={colorScheme}
        isVisible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}>
        <TransactionFilters
          filters={transactionFilters}
          onApplyFilters={handleApplyFilters}
          onRemoveFilters={handleRemoveFilters}
        />
      </BaseModal>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  scrollView: {paddingBottom: 30},
  formWrapper: {
    flex: 1,
    justifyContent: 'space-between'
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    marginTop: 12
  }
})
