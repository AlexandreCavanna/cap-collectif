import * as React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { graphql, createFragmentContainer } from 'react-relay'
import Card from '../../Ui/Card/Card'
import type { ProposalPreviewStatus_proposal } from '~relay/ProposalPreviewStatus_proposal.graphql'
import colors from '../../../utils/colors'
type Props = {
  readonly proposal: ProposalPreviewStatus_proposal
}
const TrashedReasonContainer = styled.div`
  padding: 5px;
  background-color: ${colors.pageBgc};
  border-top: 1px solid ${colors.borderColor};
`
export class ProposalPreviewStatus extends React.Component<Props> {
  render() {
    const { proposal } = this.props
    let { status } = proposal

    if (proposal.trashed) {
      const isVisible = proposal.trashedStatus === 'VISIBLE'
      const isOpinion = proposal.form.objectType === 'OPINION'
      const statusTradKey = isVisible
        ? isOpinion
          ? 'reviewed-by-moderation'
          : 'proposal.show.trashed.reason.moderated'
        : isOpinion
        ? 'global.deleted'
        : 'global.deleted.feminine'
      status = {
        color: 'DEFAULT',
        name: <FormattedMessage id={statusTradKey} />,
      }
      return (
        <>
          {proposal.trashedReason ? (
            <TrashedReasonContainer>
              <p className="px-15">
                <FormattedMessage id="admin.fields.reporting.body" />
                <br />
                <span className="excerpt">{proposal.trashedReason}</span>
              </p>
            </TrashedReasonContainer>
          ) : null}
          <Card.Status bgColor={status.color}>{status && status.name}</Card.Status>
        </>
      )
    }

    if (!status) {
      return null
    }

    return <Card.Status bgColor={status.color}>{status && status.name}</Card.Status>
  }
}
export default createFragmentContainer(ProposalPreviewStatus, {
  proposal: graphql`
    fragment ProposalPreviewStatus_proposal on Proposal
    @argumentDefinitions(stepId: { type: "ID" }, isProfileView: { type: "Boolean", defaultValue: false }) {
      trashed
      trashedStatus
      trashedReason
      status(step: $stepId) @skip(if: $isProfileView) {
        name
        color
      }
      form {
        objectType
      }
    }
  `,
})
