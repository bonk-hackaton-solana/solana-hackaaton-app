import {TOTAL_ACCOUNTS_ID} from '@shared/constants/currencies'
import {CurrenciesSectionType} from '@shared/types/currency'
import {useCallback, useEffect, useState} from 'react'

export const useGetAccountData = (
  currencies: CurrenciesSectionType[],
  accountId: string
) => {
  const [selectedCurrencyId, setSelectedCurrencyId] =
    useState<string>(accountId)

  useEffect(() => {
    if (
      !currencies ||
      currencies.length === 0 ||
      currencies[0].data.length === 0
    ) {
      return
    }

    if (accountId === TOTAL_ACCOUNTS_ID) {
      setSelectedCurrencyId(currencies[0].data[0].id)
    }
  }, [accountId])

  const getAccount = useCallback(() => {
    if (currencies && currencies.length > 0) {
      for (const currency of currencies) {
        const index = currency.data.findIndex(
          (item) => item.id === selectedCurrencyId
        )
        if (index >= 0) {
          return currency.data[index]
        }
      }
    }
  }, [currencies, selectedCurrencyId])

  return {selectedCurrencyId, setSelectedCurrencyId, getAccount}
}
