// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import css from '@styled-system/css';
import AppBox from '~ui/Primitives/AppBox';
import type { AppBoxProps } from '~ui/Primitives/AppBox.type';
import { useTable } from '~ds/Table/context';
import Th from '~ds/Table/Th';
import Td from '~ds/Table/Td';
import VisuallyHidden from '~ds/VisuallyHidden/VisuallyHidden';

type TrProps = {|
  ...AppBoxProps,
  +children: React.ChildrenArray<React.Element<typeof Th> | React.Element<typeof Td>>,
  +rowId?: string,
  +selectable?: boolean,
  +inHead?: boolean,
  +checkboxLabel?: string,
|};

type TrCheckboxProps = {|
  rowId?: string,
  checkboxLabel?: string,
  inHead: boolean,
|};

const TrCheckbox = ({ rowId, inHead, checkboxLabel }: TrCheckboxProps) => {
  const {
    dispatch,
    isRowChecked,
    hasIndeterminateState,
    hasAllRowsChecked,
    isLoading,
  } = useTable();
  const intl = useIntl();
  const checkbox = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (checkbox.current) {
      checkbox.current.indeterminate = hasIndeterminateState;
      checkbox.current.checked = hasAllRowsChecked;
    }
  }, [hasIndeterminateState, hasAllRowsChecked]);

  return inHead ? (
    <Th width="45px">
      <VisuallyHidden>
        <label htmlFor="allRows">{intl.formatMessage({ id: 'select-all-lines' })}</label>
      </VisuallyHidden>

      <input
        type="checkbox"
        id="allRows"
        className="all-rows-checkbox"
        ref={checkbox}
        disabled={isLoading}
        onChange={e => {
          if (e.target.checked) {
            dispatch({ type: 'SELECT_ALL_ROWS' });
          } else {
            dispatch({ type: 'DESELECT_ALL_ROWS' });
          }
        }}
      />
    </Th>
  ) : (
    <Td noPlaceholder aria-hidden={isLoading}>
      {!isLoading && (
        <>
          {checkboxLabel && (
            <VisuallyHidden>
              <label htmlFor={`checkbox-${String(rowId)}`}>
                {intl.formatMessage({ id: 'select-line-dynamic' }, { label: checkboxLabel })}
              </label>
            </VisuallyHidden>
          )}

          <input
            type="checkbox"
            checked={isRowChecked(String(rowId))}
            id={`checkbox-${String(rowId)}`}
            onChange={e => {
              if (e.target.checked) {
                dispatch({ type: 'SELECT_ROW', payload: String(rowId) });
              } else {
                dispatch({ type: 'DESELECT_ROW', payload: String(rowId) });
              }
            }}
          />
        </>
      )}
    </Td>
  );
};

const Tr = ({
  selectable,
  rowId,
  children,
  inHead = false,
  checkboxLabel,
  ...props
}: TrProps): React.Node => {
  const { selectable: tableSelectable, isLoading } = useTable();
  const rowSelectable: boolean = typeof selectable === 'boolean' ? selectable : tableSelectable;

  return (
    <AppBox
      as="tr"
      id={rowId}
      css={css({ ':hover': isLoading ? {} : { bg: 'gray.100' } })}
      {...props}>
      {rowSelectable && <TrCheckbox inHead={inHead} rowId={rowId} checkboxLabel={checkboxLabel} />}

      {children}
    </AppBox>
  );
};

Tr.displayName = 'Table.Tr';

export default Tr;
