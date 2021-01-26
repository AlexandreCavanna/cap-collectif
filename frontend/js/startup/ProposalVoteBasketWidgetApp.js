// @flow
import React, { lazy, Suspense } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import Providers from './Providers';
import environment, { graphqlError } from '../createRelayEnvironment';
import type {
  ProposalVoteBasketWidgetAppQueryResponse,
  ProposalVoteBasketWidgetAppQueryVariables,
} from '~relay/ProposalVoteBasketWidgetAppQuery.graphql';
import Loader from '~ui/FeedbacksIndicators/Loader';

const ProposalVoteBasketWidget = lazy(() =>
  import(/* webpackChunkName: "ProposalVoteBasketWidget" */ '~/components/Proposal/Vote/ProposalVoteBasketWidget'),
);

type Props = {
  stepId: string,
  votesPageUrl: string,
  image: string,
};

export default (data: Props) => (
  <Suspense fallback={<Loader />}>
    <Providers>
      <QueryRenderer
        variables={
          ({
            stepId: data.stepId,
          }: ProposalVoteBasketWidgetAppQueryVariables)
        }
        environment={environment}
        query={graphql`
          query ProposalVoteBasketWidgetAppQuery($stepId: ID!) {
            step: node(id: $stepId) {
              ...ProposalVoteBasketWidget_step
            }
            viewer {
              ...ProposalVoteBasketWidget_viewer @arguments(stepId: $stepId)
            }
          }
        `}
        render={({
          error,
          props,
        }: {
          ...ReactRelayReadyState,
          props: ?ProposalVoteBasketWidgetAppQueryResponse,
        }) => {
          if (error) {
            return graphqlError;
          }
          if (props) {
            if (props.step) {
              return (
                <ProposalVoteBasketWidget
                  step={props.step}
                  viewer={props.viewer}
                  image={data.image}
                  votesPageUrl={data.votesPageUrl}
                />
              );
            }
            return graphqlError;
          }
          return null;
        }}
      />
    </Providers>
  </Suspense>
);
