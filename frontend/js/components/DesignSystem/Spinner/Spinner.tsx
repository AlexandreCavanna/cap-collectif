// @ts-nocheck
import { $Diff } from 'utility-types'
import * as React from 'react'
import { css, keyframes } from 'styled-components'
import type { Props as IconProps } from '~ds/Icon/Icon'
import Icon from '~ds/Icon/Icon'

type Props = $Diff<
  IconProps,
  {
    name: any
  }
>
const spinning = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
export const Spinner = React.forwardRef<HTMLElement, Props>(({ ...props }: Props, ref) => {
  return (
    <Icon
      css={css`
        transform-origin: center center;
        animation: ${spinning} 1.7s linear infinite;
      `}
      ref={ref}
      {...props}
      name="SPINNER"
    />
  )
})
export default Spinner
