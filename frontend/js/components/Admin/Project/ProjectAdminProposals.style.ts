import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { Label as BSLabel } from 'react-bootstrap'
import DropdownSelect from '~ui/DropdownSelect'
import colors from '~/utils/colors'

export const ProjectAdminProposalsHeader: StyledComponent<any, {}, HTMLElement> = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  & > div:last-of-type {
    display: flex;
    align-items: center;

    .clearable-input {
      width: 250px;
    }
  }
`
export const ProposalListDropdownChoice: StyledComponent<any, {}, typeof DropdownSelect.Choice> = styled(
  DropdownSelect.Choice,
)`
  & span:first-of-type {
    padding-left: 0;
    & > span {
      padding-left: 24px;
    }
    & svg + span {
      padding-left: 0;
    }
  }
`
export const ProposalVotableStep: StyledComponent<any, {}, HTMLSpanElement> = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  padding: 0;
`
export const ProposalListRowInformationsStepState: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  & > * + * {
    margin-left: 20px;
  }
  & h2 {
    margin-bottom: 0;
  }
`
export const Label: StyledComponent<any, {}, typeof BSLabel> = styled(BSLabel)`
  border-radius: 12px;
  padding: 6px;
`
export const EmptyStatuses: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  display: flex;
  flex-direction: row;

  span {
    font-weight: normal;
  }

  .icon {
    width: auto;
    padding: 0;
    margin-right: 8px;
    margin-top: 2px;
  }
`
export const MergeButton: StyledComponent<any, {}, HTMLButtonElement> = styled.button`
  padding: 0;
  margin: 0;
  background: none;
  border: none;
`
export const Divider: StyledComponent<any, {}, HTMLSpanElement> = styled.span`
  width: 1px;
  height: 20px;
  background-color: ${colors.darkGray};
`
