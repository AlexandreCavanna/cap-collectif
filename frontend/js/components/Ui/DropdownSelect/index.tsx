import * as React from 'react'
import * as S from './index.style'
import DropdownSelectChoice from '~ui/DropdownSelect/choice'
import DropdownSelectSeparator from '~ui/DropdownSelect/separator'
import DropdownSelectMenu from '~ui/DropdownSelect/menu'
import type { DropdownOnChangeType, DropdownValueType } from '~ui/DropdownSelect/context'
import { DropdownSelectContext } from '~ui/DropdownSelect/context'
import DropdownSelectHeader from '~ui/DropdownSelect/header'
import DropdownSelectMessage from '~ui/DropdownSelect/message'

/**
 *
 * <DropdownSelect value={myValue}>
 *   <DropdownSelect.Choice value="oldest" />
 *   <DropdownSelect.Choice value="newest" />
 * </DropdownSelect>
 *
 * <DropdownSelect value={myValue}>
 *   <DropdownSelect.Menu name="Etape 1">
 *     <DropdownSelect.Choice value="oldest" />
 *     <DropdownSelect.Choice value="newest" />
 *   </DropdownSelect.Menu>
 *   <DropdownSelect.Menu name="Etape 2">
 *     <DropdownSelect.Choice value="oldest" />
 *     <DropdownSelect.Choice value="newest" />
 *   </DropdownSelect.Menu>
 * </DropdownSelect>
 * */
export type Props = {
  readonly mode?: 'normal' | 'add-remove'
  readonly initialValue?: DropdownValueType
  readonly className?: string
  readonly isMultiSelect?: boolean
  readonly title?: JSX.Element | JSX.Element[] | string
  readonly shouldOverflow?: boolean
  readonly value?: DropdownValueType
  readonly onChange?: DropdownOnChangeType
  readonly children: JSX.Element | JSX.Element[] | string | any
  readonly disabled?: boolean
  readonly defaultValue?: string
}

const DropdownSelect = ({
  children,
  title,
  value,
  defaultValue,
  onChange,
  initialValue: initial = [],
  mode = 'normal',
  shouldOverflow = false,
  isMultiSelect = false,
  disabled = false,
  className,
}: Props) => {
  const [initialValue, setInitialValue] = React.useState(initial)
  const allValues = React.useMemo(
    () => (typeof initial === 'string' ? [initial] : initial),
    [initial],
  ) as any as ReadonlyArray<string>
  React.useEffect(() => {
    if (mode === 'add-remove' && onChange) {
      onChange({
        all: allValues,
        values: [],
        added: [],
        removed: [],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, onChange])
  const contextValue = React.useMemo(
    () => ({
      value,
      onChange,
      mode,
      allValues,
      isMultiSelect,
      setInitialValue,
      initialValue,
      disabled,
      defaultValue,
    }),
    [value, mode, initialValue, allValues, setInitialValue, onChange, isMultiSelect, disabled, defaultValue],
  )
  return (
    <DropdownSelectContext.Provider value={contextValue}>
      <S.Container shouldOverflow={shouldOverflow} className={className}>
        {title && <S.Header>{title}</S.Header>}
        <S.Body>{children}</S.Body>
      </S.Container>
    </DropdownSelectContext.Provider>
  )
}

DropdownSelect.Choice = DropdownSelectChoice
DropdownSelect.Separator = DropdownSelectSeparator
DropdownSelect.Header = DropdownSelectHeader
DropdownSelect.Menu = DropdownSelectMenu
DropdownSelect.Message = DropdownSelectMessage
export default DropdownSelect
