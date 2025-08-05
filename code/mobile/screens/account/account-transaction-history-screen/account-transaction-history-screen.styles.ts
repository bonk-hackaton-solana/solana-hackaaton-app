import {useCreateStyles} from '@shared/hooks/use-create-styles'

export const useGetStyles = () => {
  return useCreateStyles(
    (colors) => ({
      button: {
        borderColor: colors.component.border,
        backgroundColor: colors.component.main,
        borderWidth: 1,
        borderRadius: 70,
        height: 56
      }
    }),
    (colors) => ({
      button: {
        borderColor: colors.component.border,
        backgroundColor: colors.component.main,
        borderWidth: 1,
        borderRadius: 70,
        height: 56
      }
    })
  )
}
