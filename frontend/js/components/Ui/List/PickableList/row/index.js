// @flow
import * as React from 'react';
import * as S from './styles';
import { usePickableList } from '~ui/List/PickableList';

type Props = {
  children: React.Node,
  rowId: string | number,
};

const PickableListRow = ({ children, rowId }: Props) => {
  const { dispatch, isRowChecked } = usePickableList();
  return (
    <S.Container>
      <input
        type="checkbox"
        checked={isRowChecked(String(rowId))}
        onChange={e => {
          if (e.target.checked) {
            dispatch({ type: 'SELECT_ROW', payload: String(rowId) });
          } else {
            dispatch({ type: 'DESELECT_ROW', payload: String(rowId) });
          }
        }}
      />
      {children}
    </S.Container>
  );
};

PickableListRow.displayName = 'PickableList.Row';

export default PickableListRow;