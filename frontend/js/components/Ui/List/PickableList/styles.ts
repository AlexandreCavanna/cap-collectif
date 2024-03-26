import styled from 'styled-components'
import Loader from '~ui/FeedbacksIndicators/Loader'
import { CollapsableBody } from '~ui/Collapsable/index.styles'
import colors from '~/utils/colors'

export const Container = styled.div<{
  isLoading: boolean
}>`
  position: relative;
`
export const GlobalLoaderContainer = styled.div`
  & * {
    pointer-events: none;
    user-select: none;
  }

  &
    ${
      /* sc-selector */
      CollapsableBody
    } {
    display: none;
  }

  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  content: '';
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  border-radius: 6px;
  background: ${colors.white};
  opacity: 0.6;
  z-index: 100;
`
export const GlobalLoader = styled(Loader)`
  z-index: 100;
`
