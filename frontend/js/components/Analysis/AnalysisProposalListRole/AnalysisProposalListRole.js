// @flow
import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { useIntl } from 'react-intl';
import { createFragmentContainer, graphql } from 'react-relay';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import UserAvatar, { type Badge } from '~/components/User/UserAvatar';
import { PROPOSAL_STATUS } from '~/constants/AnalyseConstants';
import { ICON_NAME } from '~ui/Icons/Icon';
import type { AnalysisProposalListRole_proposal } from '~relay/AnalysisProposalListRole_proposal.graphql';
import AnalysisProposalListRoleContainer, {
  AVATAR_SIZE,
  RoleWrapper,
} from '~/components/Analysis/AnalysisProposalListRole/AnalysisProposalListRole.style';
import UserAnalystList from '~/components/Analysis/UserAnalystList/UserAnalystList';

export type Status = {|
  name: string,
  icon: $Values<typeof ICON_NAME>,
  label: string,
  color: string,
|};

type Props = {|
  proposal: AnalysisProposalListRole_proposal,
  dispatch: any => void,
|};

export const getStatus = (analyse: ?Object, isDecisionMaker: boolean = false): Status => {
  if (isEmpty(analyse) || !analyse) return PROPOSAL_STATUS.TODO;

  if (isDecisionMaker && analyse.state === 'DONE' && analyse.isApproved) {
    return PROPOSAL_STATUS.DONE;
  }

  if (isDecisionMaker && analyse.state === 'DONE' && !analyse.isApproved) {
    return PROPOSAL_STATUS.UNFAVOURABLE;
  }

  return PROPOSAL_STATUS[analyse.state];
};

export const getBadge = ({ icon, color }: Status, isSmall: boolean = false): Badge => ({
  icon,
  color,
  size: isSmall ? 10 : 16,
  iconSize: isSmall ? 6 : 10,
  iconColor: '#fff',
});

const AnalysisProposalListRole = ({ proposal, dispatch }: Props) => {
  const { assessment, decision, supervisor, decisionMaker } = proposal;
  const intl = useIntl();

  return (
    <AnalysisProposalListRoleContainer>
      <RoleWrapper className="role-analysts">
        <UserAnalystList proposal={proposal} dispatch={dispatch} />
      </RoleWrapper>

      <RoleWrapper className="role-supervisor">
        {supervisor && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="avatar-supervisor">
                {intl.formatMessage({ id: 'global.assigned.to' })} {supervisor.username}
              </Tooltip>
            }>
            <UserAvatar
              user={supervisor}
              displayUrl={false}
              size={AVATAR_SIZE}
              badge={getBadge(getStatus(assessment))}
              onClick={() => dispatch({ type: 'CHANGE_SUPERVISOR_FILTER', payload: supervisor.id })}
            />
          </OverlayTrigger>
        )}
      </RoleWrapper>

      <RoleWrapper>
        {decisionMaker && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="avatar-decisionMaker">
                {intl.formatMessage({ id: 'global.assigned.to' })} {decisionMaker.username}
              </Tooltip>
            }>
            <UserAvatar
              user={decisionMaker}
              displayUrl={false}
              size={AVATAR_SIZE}
              badge={getBadge(getStatus(decision, true))}
              onClick={() =>
                dispatch({ type: 'CHANGE_DECISION_MAKER_FILTER', payload: decisionMaker.id })
              }
            />
          </OverlayTrigger>
        )}
      </RoleWrapper>
    </AnalysisProposalListRoleContainer>
  );
};

export default createFragmentContainer(AnalysisProposalListRole, {
  proposal: graphql`
    fragment AnalysisProposalListRole_proposal on Proposal {
      ...UserAnalystList_proposal
      assessment {
        state
        updatedBy {
          id
        }
      }
      decision {
        state
        isApproved
        updatedBy {
          id
        }
      }
      supervisor {
        id
        username
        ...UserAvatar_user
      }
      decisionMaker {
        id
        username
        ...UserAvatar_user
      }
    }
  `,
});