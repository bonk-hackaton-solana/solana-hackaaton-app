import {TYPOGRAPHY} from '@shared/constants/typography'
import {useCreateStyles} from '@shared/hooks/use-create-styles'

export const useGetColors = () => {
  return useCreateStyles(
    (colors) => ({
      root: {
        backgroundColor: colors.grayscale.grayscale200
      },
      imageWrapper: {
        backgroundColor: colors.grayscale.grayscale500
      },
      detailsWrapper: {
        backgroundColor: colors.grayscale.grayscale50
      },
      title: {
        color: colors.grayscale.grayscale900
      },
      value: {
        color: colors.grayscale.grayscale30
      }
    }),
    (colors) => ({
      root: {
        backgroundColor: colors.app.modal
      },
      imageWrapper: {
        backgroundColor: colors.component.main
      },
      detailsWrapper: {
        backgroundColor: colors.component.main
      },
      title: {
        color: colors.grayscale.grayscale50
      },
      value: {
        color: colors.grayscale.grayscale30,
        ...TYPOGRAPHY.body4Regular14
      }
    })
  )
}
