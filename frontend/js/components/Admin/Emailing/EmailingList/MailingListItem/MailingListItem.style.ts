import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import PickableList from '~ui/List/PickableList'
import colors from '~/utils/colors'

export const Container = styled(PickableList.Row)<{
  selected: boolean
}>`
  background-color: ${props => (props.selected ? colors.paleGrey : '#fff')};

  & > .pickableList-row-content {
    display: flex;
    flex-direction: column;
  }

  .project-title {
    color: ${colors.silverChalice};
    margin-bottom: 5px;
  }
`
export const ButtonMembers: StyledComponent<any, {}, HTMLButtonElement> = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  line-height: 1;
`
