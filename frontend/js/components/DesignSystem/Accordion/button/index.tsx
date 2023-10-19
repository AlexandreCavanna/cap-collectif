// @ts-nocheck
import * as React from 'react'
import Flex from '~ui/Primitives/Layout/Flex'
import Icon, { ICON_NAME, ICON_SIZE } from '~ds/Icon/Icon'
import { AccordionItemContext } from '~ds/Accordion/item/context'
import type { ButtonProps } from '~ds/Button/Button'
import Button from '~ds/Button/Button'
import { FontWeight } from '~ui/Primitives/constants'

type Props = ButtonProps & {
  children: JSX.Element | JSX.Element[] | string
  disabled?: boolean
}

const AccordionButton = ({ children, ...props }: Props) => {
  const { disabled, toggleOpen, open } = React.useContext(AccordionItemContext)
  const button = React.useRef<HTMLButtonElement | null>(null)
  const toggle = React.useCallback(() => {
    if (disabled) return
    toggleOpen()
  }, [disabled, toggleOpen])
  return (
    <Button
      ref={button}
      disabled={disabled}
      onClick={toggle}
      px={8}
      py={8}
      width="100%"
      fontWeight={FontWeight.Normal}
      color="blue.900"
      {...props}
    >
      <Icon name={open ? ICON_NAME.ARROW_DOWN : ICON_NAME.ARROW_RIGHT} size={ICON_SIZE.MD} marginRight={1} />
      <Flex direction="row">{children}</Flex>
    </Button>
  )
}

export default AccordionButton
