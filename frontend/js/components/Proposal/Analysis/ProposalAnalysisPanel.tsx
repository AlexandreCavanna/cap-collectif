import React, { useState } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ProposalAnalysisUserRow from './ProposalAnalysisUserRow'
import type { ProposalAnalysisPanel_proposal$data } from '~relay/ProposalAnalysisPanel_proposal.graphql'
import type { ProposalAnalysisPanel_viewer$data } from '~relay/ProposalAnalysisPanel_viewer.graphql'
import colors from '~/utils/colors'
import type { State } from '~/types'
import ProposalFormSwitcher from './ProposalFormSwitcher'
import { PROPOSAL_STATUS } from '~/constants/AnalyseConstants'
import type { PanelState, User } from './types'
import { CloseIcon } from './ProposalAnalysisPanelCloseIcon'

const PanelsSlider = styled.div<{
  home: boolean
}>`
  display: flex;
  width: 400px;
  overflow: ${props => props.home && 'hidden'};
  margin-left: ${props => (props.home ? 0 : '-400px')};
  transition: 0.5s;

  > div {
    min-width: 400px;
  }
`
const Panel = styled.div`
  background: ${colors.white};
  margin-left: 30px;
  margin-right: 30px;
  padding-top: 30px;
`
const PanelSection = styled.div<{
  border?: boolean
}>`
  > p {
    font-size: 20px;
    color: ${colors.secondaryGray};
    margin-bottom: 15px;
  }

  padding-bottom: 15px;
  border-bottom: ${props => props.border && `1px solid ${colors.lightGray}`};
  margin-bottom: 15px;
`
const CloseIconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  > p {
    font-size: 20px;
    color: ${colors.secondaryGray};
    margin-bottom: 15px;
  }
`
type Props = {
  proposal: ProposalAnalysisPanel_proposal$data
  onClose: () => void
  user: User
  viewer: ProposalAnalysisPanel_viewer$data
}
export const getStatus = (status: any | null | undefined, proposal: any) => {
  if (
    !status &&
    ((proposal?.decision && proposal?.decision.state === PROPOSAL_STATUS.DONE.name.toUpperCase()) ||
      (proposal?.assessment &&
        (proposal?.assessment.state === PROPOSAL_STATUS.FAVOURABLE.name.toUpperCase() ||
          proposal?.assessment.state === PROPOSAL_STATUS.UNFAVOURABLE.name.toUpperCase())))
  ) {
    return 'TOO_LATE'
  }

  if ((status && status === PROPOSAL_STATUS.FAVOURABLE.name) || status === PROPOSAL_STATUS.UNFAVOURABLE.name) {
    return status
  }

  return status
}
export const ProposalAnalysisPanel = ({ proposal, onClose, user, viewer }: Props) => {
  const [panelState, setPanelState] = useState<PanelState>('HOME')
  const [panelViewUser, setPanelViewUser] = useState<User>(user)
  if (!proposal.analysts || !user) return null
  const analysts = proposal.analysts.filter(analyst => analyst.id !== user.id)
  const userAnalyst = proposal.analysts?.find(analyst => analyst.id === user.id)
  if (userAnalyst) analysts.unshift(userAnalyst)
  const closed = proposal.decision?.state === 'DONE'
  const proposalState = proposal.assessment?.state
  const decisionState =
    proposal.decision?.state === 'IN_PROGRESS'
      ? 'IN_PROGRESS'
      : proposal.decision?.isApproved === false
      ? 'UNFAVOURABLE'
      : proposal.decision?.isApproved
      ? 'FAVOURABLE'
      : undefined
  return (
    <PanelsSlider home={panelState === 'HOME'} id="proposal_analysis_panel">
      <div>
        <Panel>
          <PanelSection border id="proposal_analysis_analyses">
            <CloseIconWrapper>
              <FormattedMessage id="panel.analysis.subtitle" tagName="p" />
              <CloseIcon
                onClose={() => {
                  setPanelState('HOME')
                  onClose()
                }}
              />
            </CloseIconWrapper>
            <div>
              {analysts?.map((analyst, idx) => {
                const status = proposal.analyses?.find(a => a.analyst.id === analyst.id) // @ts-ignore
                const disabled = (proposalState && proposalState !== 'IN_PROGRESS') || closed || status === 'TOO_LATE'
                return (
                  <div className="mt-10">
                    <ProposalAnalysisUserRow
                      canConsult={
                        !!status ||
                        (proposal.viewerCanAnalyse &&
                          !idx &&
                          !(closed || (proposalState && proposalState !== 'IN_PROGRESS')))
                      }
                      canEdit={proposal.viewerCanAnalyse && !idx && !disabled}
                      disabled={!status && (closed || (proposalState && proposalState !== 'IN_PROGRESS'))}
                      user={analyst}
                      status={getStatus(status?.state, proposal)}
                      onClick={(view: boolean | null | undefined) => {
                        setPanelViewUser({
                          id: analyst.id || '',
                          displayName: analyst.displayName || '',
                        })
                        setPanelState(view ? 'VIEW_ANALYSIS' : 'EDIT_ANALYSIS')
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </PanelSection>
          {proposal.supervisor && (
            <PanelSection border id="proposal_analysis_assessment">
              <FormattedMessage id="global.review" tagName="p" />
              <div>
                <ProposalAnalysisUserRow
                  canConsult={!!proposal.assessment?.state || proposal.viewerCanEvaluate}
                  canEdit={proposal.viewerCanEvaluate}
                  onClick={(view: boolean | null | undefined) => {
                    setPanelViewUser({
                      id: proposal.supervisor?.id || '',
                      displayName: proposal.supervisor?.displayName || '',
                    })
                    setPanelState(view ? 'VIEW_ASSESSMENT' : 'EDIT_ASSESSMENT')
                  }}
                  disabled={closed || proposal.assessment?.state === 'TOO_LATE'}
                  user={proposal.supervisor}
                  status={getStatus(proposal.assessment?.state, proposal)}
                />
              </div>
            </PanelSection>
          )}
          {proposal.decisionMaker && (
            <PanelSection id="proposal_analysis_decision">
              <FormattedMessage id="global.decision" tagName="p" />
              <div>
                <ProposalAnalysisUserRow
                  canConsult={!!proposal.decision?.state || proposal.viewerCanDecide}
                  canEdit={proposal.viewerCanDecide}
                  user={proposal.decisionMaker}
                  status={decisionState}
                  decidor
                  onClick={(view: boolean | null | undefined) => {
                    setPanelViewUser({
                      id: proposal.decisionMaker?.id || '',
                      displayName: proposal.decisionMaker?.displayName || '',
                    })
                    setPanelState(view ? 'VIEW_DECISION' : 'EDIT_DECISION')
                  }}
                />
              </div>
            </PanelSection>
          )}
        </Panel>
      </div>
      <ProposalFormSwitcher
        proposal={proposal}
        onClose={onClose}
        onBackClick={() => setPanelState('HOME')}
        disabled={false}
        user={panelViewUser}
        panelState={panelState}
        viewer={viewer}
      />
    </PanelsSlider>
  )
}

const mapStateToProps = (state: State) => ({
  user: {
    id: state.user.user?.id || '',
    displayName: state.user.user?.username || '',
  },
})

export default createFragmentContainer(connect(mapStateToProps)(ProposalAnalysisPanel), {
  viewer: graphql`
    fragment ProposalAnalysisPanel_viewer on User {
      ...ProposalFormSwitcher_viewer
    }
  `,
  proposal: graphql`
    fragment ProposalAnalysisPanel_proposal on Proposal
    @argumentDefinitions(proposalRevisionsEnabled: { type: "Boolean!" }) {
      id
      ...ProposalFormSwitcher_proposal @arguments(proposalRevisionsEnabled: $proposalRevisionsEnabled)
      analysts {
        id
        displayName
        ...ProposalAnalysisUserRow_user
      }
      decisionMaker {
        id
        displayName
        ...ProposalAnalysisUserRow_user
      }
      supervisor {
        id
        displayName
        ...ProposalAnalysisUserRow_user
      }
      analyses {
        id
        state
        analyst {
          id
        }
      }
      assessment {
        state
        id
        supervisor {
          id
        }
      }
      decision {
        id
        state
        decisionMaker {
          id
        }
        isApproved
      }

      viewerCanDecide
      viewerCanAnalyse
      viewerCanEvaluate
    }
  `,
})
