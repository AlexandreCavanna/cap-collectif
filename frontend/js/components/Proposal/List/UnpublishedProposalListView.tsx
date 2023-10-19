import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import type { UnpublishedProposalListView_step } from '~relay/UnpublishedProposalListView_step.graphql'
import type { UnpublishedProposalListView_viewer } from '~relay/UnpublishedProposalListView_viewer.graphql'
import ProposalList from './ProposalList'

type Props = {
  step: UnpublishedProposalListView_step
  viewer: UnpublishedProposalListView_viewer
}
export class UnpublishedProposalListView extends React.Component<Props> {
  render() {
    const { step, viewer } = this.props

    if (
      !step.viewerProposalsUnpublished ||
      step.viewerProposalsUnpublished.totalCount === 0 ||
      !step.viewerProposalsUnpublished.edges ||
      !step.viewerProposalsUnpublished.edges[0]
    ) {
      return null
    }

    const { notPublishedReason } = step.viewerProposalsUnpublished.edges[0].node
    return (
      <Panel bsStyle="danger">
        <Panel.Heading>
          <Panel.Title componentClass="h3">
            <strong>
              <FormattedMessage
                id="count-proposal"
                values={{
                  num: step.viewerProposalsUnpublished.totalCount,
                }}
              />
            </strong>{' '}
            <FormattedMessage
              id={
                notPublishedReason === 'WAITING_AUTHOR_CONFIRMATION'
                  ? 'awaiting-publication-lowercase'
                  : 'unpublished-lowercase'
              }
              values={{
                num: step.viewerProposalsUnpublished.totalCount,
              }}
            />
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <ProposalList
            step={step}
            proposals={step.viewerProposalsUnpublished}
            viewer={viewer}
            view="GRID"
            id="proposals-unpublished-list"
          />
        </Panel.Body>
      </Panel>
    )
  }
}
export default createFragmentContainer(UnpublishedProposalListView, {
  viewer: graphql`
    fragment UnpublishedProposalListView_viewer on User @argumentDefinitions(stepId: { type: "ID!" }) {
      ...ProposalList_viewer @arguments(stepId: $stepId)
    }
  `,
  step: graphql`
    fragment UnpublishedProposalListView_step on ProposalStep
    @argumentDefinitions(isAuthenticated: { type: "Boolean!" }, token: { type: "String" }) {
      id
      ...ProposalList_step
      viewerProposalsUnpublished(first: 100)
        @include(if: $isAuthenticated)
        @connection(key: "UnpublishedProposalListView_viewerProposalsUnpublished", filters: []) {
        totalCount
        ...ProposalList_proposals @arguments(token: $token)
        edges {
          node {
            id
            notPublishedReason
          }
        }
      }
    }
  `,
})
