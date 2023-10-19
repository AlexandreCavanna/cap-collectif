import * as React from 'react'
import styled from 'styled-components'
import { Table as BtstTable } from 'react-bootstrap'
import colors from '../../../utils/colors'

type Props = {
  children?: JSX.Element | JSX.Element[] | string | null | undefined
  hover?: boolean
  bordered?: boolean
  tableLayoutFixed?: boolean
}
export const Container = styled.div<{
  tableLayoutFixed: boolean
}>`
  color: ${colors.darkText};
  background-color: ${colors.white};
  border: 1px solid ${colors.borderColor};
  margin-bottom: 20px;
  overflow-x: scroll;
  border-radius: 4px 4px 0 0;

  .table {
    table-layout: ${props => (props.tableLayoutFixed ? 'fixed' : 'auto')};
    margin-bottom: 0;
    border: none;
  }

  thead > tr > th {
    background-color: ${colors.pageBgc};
    border-bottom-width: 1px;
  }

  thead > tr > th,
  tbody > tr > td {
    padding: 10px 15px;
    vertical-align: middle;

    &:first-child {
      border-left: none;
    }

    &:last-child {
      border-right: none;
    }
  }

  td:not(:first-child) {
    font-weight: 500;
  }

  tbody > tr:last-child td {
    border-bottom: none;
  }

  span.badge-pill {
    font-size: 13px;
    font-weight: 400;
  }

  ul {
    color: ${colors.darkText};
    font-weight: 500;
  }

  @media (max-width: 991px) {
    thead th:first-child {
      min-width: 150px;
    }
  }
`
export class Table extends React.PureComponent<Props> {
  render() {
    const { children, hover, bordered, tableLayoutFixed } = this.props
    return (
      <Container tableLayoutFixed={tableLayoutFixed}>
        <BtstTable hover={hover} bordered={bordered}>
          {children}
        </BtstTable>
      </Container>
    )
  }
}
export default Table
