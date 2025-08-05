import {TYPOGRAPHY} from '@shared/constants/typography'
import {useCreateStyles} from '@shared/hooks/use-create-styles'

export const useGetStyles = () => {
  return useCreateStyles(
    (colors) => ({
      scrollView: {
        flex: 1
      },
      createAccountModal: {
        paddingBottom: 24
      },
      topupButton: {
        alignSelf: 'center',
        width: 'auto',
        borderRadius: 30,
        backgroundColor: colors.grayscale.grayscale50,
        paddingHorizontal: 20,
        height: 'auto',
        paddingVertical: 12,
        marginBottom: 30
      },
      topupButtonText: {
        color: colors.grayscale.grayscale10,
        ...TYPOGRAPHY.body2Bold14
      }
    }),
    (colors) => ({
      scrollView: {
        flex: 1,
        marginTop: 32
      },
      createAccountModal: {
        paddingBottom: 24
      },
      topupButton: {
        alignSelf: 'center',
        width: 'auto',
        borderRadius: 30,
        backgroundColor: colors.grayscale.grayscale50,
        paddingHorizontal: 20,
        height: 'auto',
        paddingVertical: 12,
        marginVertical: 30
      },
      topupButtonText: {
        color: colors.grayscale.grayscale10,
        ...TYPOGRAPHY.body2Bold14
      }
    })
  )
}
