import {TYPOGRAPHY} from '@shared/constants/typography'
import {useCreateStyles} from '@shared/hooks/use-create-styles'

export const useGetStyles = () => {
  return useCreateStyles(
    (colors) => ({
      title: {
        ...TYPOGRAPHY.body2Bold14,
        color: colors.grayscale.grayscale50,
        marginBottom: 8
      },
      caption: {
        ...TYPOGRAPHY.body2Light15,
        color: colors.grayscale.grayscale30,
        marginBottom: 20
      },
      button: {
        borderColor: colors.component.border,
        backgroundColor: colors.component.main,
        borderWidth: 1,
        borderRadius: 70,
        height: 56
      }
    }),
    (colors) => ({
      title: {
        ...TYPOGRAPHY.body2Bold14,
        color: colors.grayscale.grayscale50,
        marginBottom: 8
      },
      caption: {
        ...TYPOGRAPHY.body2Light15,
        color: colors.grayscale.grayscale30,
        marginBottom: 20
      },
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
