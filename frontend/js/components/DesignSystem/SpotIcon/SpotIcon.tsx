// @ts-nocheck
import { $Values, $PropertyType } from 'utility-types'
import * as React from 'react'
import cn from 'classnames'

import styled from 'styled-components'
import { variant } from 'styled-system'
import type { AppBoxProps, Responsive } from '~ui/Primitives/AppBox.type'
import * as SpotIcons from './index'
import AppBox from '~ui/Primitives/AppBox'

export const SPOT_ICON_NAME = {
  PENCIL_SOFTWARE: 'PENCIL_SOFTWARE',
  EMAIL_TIMEOUT: 'EMAIL_TIMEOUT',
  EMAIL_SEND: 'EMAIL_SEND',
  RATING_CLICK: 'RATING_CLICK',
  DELETE: 'DELETE',
  USER_DISCUSS: 'USER_DISCUSS',
  BULB_SKETCH: 'BULB_SKETCH',
  UPLOAD: 'UPLOAD',
  CHATTING: 'CHATTING',
  MAIL: 'MAIL',
  MAIL_1: 'MAIL_1',
  MAIL_2: 'MAIL_2',
  ERROR: 'ERROR',
  QUESTIONNAIRE: 'QUESTIONNAIRE',
  FORM: 'FORM',
  NEWSPAPER: 'NEWSPAPER',
  CALENDAR: 'CALENDAR',
  PROJECT: 'PROJECT',
  SMS: 'SMS',
  LOCK_EYE: 'LOCK_EYE',
}
export const SPOT_ICON_SIZE = {
  SM: 'sm',
  // 56px
  MD: 'md',
  // 64px
  LG: 'lg',
  // 124px
  XL: 'xl', // 200px
}
export type Props = AppBoxProps & {
  name: $Values<typeof SPOT_ICON_NAME>
  className?: string
  color?: Responsive<string>
  size?: Responsive<$Values<typeof SPOT_ICON_SIZE>>
}

const getSize = (size: $PropertyType<Props, 'size'> = 'md'): number | string => {
  switch (size) {
    case 'sm':
      return 11

    case 'md':
    default:
      return 12

    case 'lg':
      return '124px'

    case 'xl':
      return '200px'
  }
}

const SpotIconInner = styled(AppBox).attrs(props => ({
  minSize: getSize(props.variant),
  maxSize: getSize(props.variant),
}))(
  variant({
    variants: {
      sm: {
        size: 11,
        p: 2,
      },
      md: {
        size: 12,
        p: '10px',
      },
      lg: {
        size: '124px',
        p: 4,
      },
    },
  }),
)
const SpotIcon = React.forwardRef<HTMLElement, Props>(
  ({ name, size = SPOT_ICON_SIZE.MD, className, color = 'inherit', ...props }: Props, ref) => {
    const SpotIconSvg = SpotIcons[name]
    return (
      <SpotIconInner
        as={SpotIconSvg}
        variant={size}
        className={cn('spot-icon', className)}
        ref={ref}
        color={color}
        css={{
          overflow: 'visible !important',
        }}
        {...props}
      />
    )
  },
)
SpotIcon.displayName = 'SpotIcon'
export default SpotIcon
