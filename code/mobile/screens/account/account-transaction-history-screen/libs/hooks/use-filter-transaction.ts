import {dateUtilities} from '@shared/services/date-utilities'
import {useForm} from 'react-hook-form'

export type FormFilterValuesType = {
  types: string[]
  monthTimestamp: number
  yearTimestamp: number
}

export const useFilterTransaction = () => {
  const hookFormMethods = useForm<FormFilterValuesType>({
    mode: 'onChange',
    defaultValues: {
      types: [],
      monthTimestamp: dateUtilities.getCurrentMonthTimestamp(),
      yearTimestamp: dateUtilities.getCurrentYearTimestamp()
    }
  })

  return {hookFormMethods}
}
