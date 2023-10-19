// @ts-nocheck
import * as React from 'react'
import css from '@styled-system/css'
import AppBox from '~ui/Primitives/AppBox'
import type { AppBoxProps } from '~ui/Primitives/AppBox.type'
import { useTable } from '~ds/Table/context'
import TrCheckbox from './TrCheckbox'
type VerticalAlign = 'top' | 'middle' | 'bottom'
type TrProps = AppBoxProps & {
  readonly children: JSX.Element | JSX.Element[] | string
  readonly rowId?: string
  readonly selectable?: boolean
  readonly inHead?: boolean
  readonly checkboxLabel?: string
  readonly verticalAlign?: VerticalAlign
}

const styles = (isLoading: boolean | null | undefined, verticalAlign: VerticalAlign) =>
  css({
    ':hover': isLoading
      ? {}
      : {
          bg: 'gray.100',
          '.visible-on-hover': {
            opacity: 1,
          },
        },
    '& td': {
      verticalAlign,
      '&.visible-on-hover': {
        opacity: 0,
      },
    },
  })

const Tr = ({
  selectable,
  rowId,
  children,
  inHead = false,
  checkboxLabel,
  verticalAlign = 'middle',
  ...props
}: TrProps): JSX.Element => {
  const { selectable: tableSelectable, isLoading } = useTable()
  const rowSelectable: boolean = typeof selectable === 'boolean' ? selectable : tableSelectable
  return (
    <AppBox as="tr" id={rowId} css={styles(isLoading, verticalAlign)} {...props}>
      {rowSelectable && <TrCheckbox inHead={inHead} rowId={rowId} checkboxLabel={checkboxLabel} />}

      {children}
    </AppBox>
  )
}

Tr.displayName = 'Table.Tr'
export default Tr
