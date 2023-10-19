import styled, { css } from 'styled-components'
import colors from '~/utils/colors'
import { mediaQueryMobile } from '~/utils/sizes'

const ItemContainer = styled.div.attrs({
  className: 'list__item',
})<{
  isEmpty?: boolean
  width?: string
  center?: boolean
  mobileTop?: boolean
}>`
  display: flex;
  align-items: ${props => (props.center ? 'center' : 'flex-start')};
  border: 1px solid #ddd;
  width: ${props => props.width || '372px'};
  border-radius: 4px;
  min-height: ${props => props.isEmpty && '46px'};
  padding: ${props => (props.isEmpty ? '8px 15px' : '12px 15px')};
  border-style: ${props => props.isEmpty && 'dashed'};
  background-color: ${props => (props.isEmpty ? '#fff' : '#fafafa')};
  word-break: break-word;

  svg,
  path {
    display: block;
  }

  .icon-menu,
  .btn-remove-choice {
    margin-top: 2px;
  }

  .icon-menu {
    color: ${colors.iconGrayColor};
    margin-right: 15px;
    height: 12px;
    width: 20px;
  }

  .btn-remove-choice {
    background: none;
    border: none;
    margin-left: 15px;
    padding: 0;
    color: ${colors.darkGray};
  }

  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    width: 100%;
    justify-content: space-between;

    .icon-menu {
      order: 3;
      margin-left: 15px;
      margin-right: 0;
    }

    .btn-remove-choice {
      order: -1;
      margin-right: 15px;
      margin-left: 0;
    }

    ${props =>
      props.mobileTop &&
      css`
        .icon-menu {
          position: absolute;
          right: 20px;
          top: 15px;
        }
      `}
  }
`
export default ItemContainer
