import styled from 'styled-components'
import PickableList from '~ui/List/PickableList'
import colors from '~/utils/colors'
import Tag from '~ui/Labels/Tag'

export const AnalysisProposalContainer = styled(PickableList.Row)<{
  asPlaceholder?: boolean
}>`
  &:hover {
    background: ${props => (props?.asPlaceholder ? 'white' : colors.paleGrey)};
  }

  & > .pickableList-row-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
  }
`
export const ProposalInformationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  width: 50%;

  a {
    color: ${colors.primaryColor};
  }
`
export const ProposalListRowHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 5px 0;

  h2 {
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    margin: 0;
  }
`
export const StateTag = styled.div`
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  color: ${colors.darkGray};
  border: 1px solid ${colors.darkGray};
  padding: 0 4px;
  margin-right: 8px;
`
export const ProposalListRowInformations = styled.div`
  display: flex;
  align-items: center;

  p {
    margin: 0;
  }
`
export const ProposalTag = styled(Tag)`
  max-width: 50%;

  &:hover {
    cursor: pointer;
    color: ${colors.primaryColor};
  }
`
export const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 12px 0 0 0;

  button {
    background: none;
    border: none;
    color: ${colors.primaryColor};
    padding: 2px 10px 2px 0;
    margin-left: 12px;
    border-right: 1px solid ${colors.lightGray};

    &:hover {
      font-weight: 600;
    }

    &:first-of-type {
      margin-left: 0;
    }

    &:last-of-type {
      border-right: none;
    }
  }
`
export default AnalysisProposalContainer
