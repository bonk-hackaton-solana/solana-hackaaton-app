import {useLazyGetAllAccountTransactionsQuery} from '@entities/account/model/api/account-api'
import {errorHandler} from '@shared/services/error-handler'
import {useCallback} from 'react'

export const useGetAccountOperations = () => {
  const [getTransactions, {data: transactions}] =
    useLazyGetAllAccountTransactionsQuery()

  const fetchOperations = useCallback(async () => {
    try {
      await getTransactions({
        cursor: null,
        limit: 100,
        pagination: {
          limit: 100,
          offset: 0
        }
      })
    } catch (e) {
      errorHandler.handleRequest(e)
    }
  }, [])

  return {operations: transactions?.items ?? [], fetchOperations}
}
