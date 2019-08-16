// @flow
import * as React from 'react';
import classNames from 'classnames';
import { Row } from 'react-bootstrap';
import { QueryRenderer, graphql, type ReadyState } from 'react-relay';
import environment, { graphqlError } from '../../createRelayEnvironment';
import Loader from '../Ui/FeedbacksIndicators/Loader';
import ProposalPreview from '../Proposal/Preview/ProposalPreview';
import type {
  LastProposalsQueryResponse,
  LastProposalsQueryVariables,
} from '~relay/LastProposalsQuery.graphql';

export type Props = {|
  +ids: $ReadOnlyArray<string>,
|};

export class LastProposals extends React.Component<Props> {
  render() {
    const { ids } = this.props;
    return (
      <div className="container">
        <QueryRenderer
          environment={environment}
          query={graphql`
            query LastProposalsQuery($ids: [ID!]!, $stepId: ID!) {
              proposals: nodes(ids: $ids) {
                ... on Proposal {
                  id
                  ...ProposalPreview_proposal
                    @arguments(stepId: "", isAuthenticated: false, isProfileView: true)
                }
              }
            }
          `}
          variables={
            ({
              ids,
              stepId: '',
            }: LastProposalsQueryVariables)
          }
          render={({ error, props }: { props?: ?LastProposalsQueryResponse, ...ReadyState }) => {
            if (error) {
              return graphqlError;
            }

            if (!props) {
              return <Loader />;
            }

            const { proposals } = props;
            return (
              <Row>
                <ul
                  className={classNames({
                    'media-list': true,
                    'proposal-preview-list': true,
                    opinion__list: true,
                  })}>
                  {proposals.filter(Boolean).map(proposal => (
                    /* $FlowFixMe $refType */
                    <ProposalPreview
                      key={proposal.id}
                      proposal={proposal}
                      step={null}
                      viewer={null}
                    />
                  ))}
                </ul>
              </Row>
            );
          }}
        />
      </div>
    );
  }
}

export default LastProposals;
