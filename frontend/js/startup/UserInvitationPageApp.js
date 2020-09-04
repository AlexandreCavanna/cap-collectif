// @flow
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import AlertBoxApp from '~/startup/AlertBoxApp';
import UserInvitationPage from '~/components/User/Invitation/UserInvitationPage';
import environment, { graphqlError } from '~/createRelayEnvironment';
import type { UserInvitationPageAppQueryResponse } from '~relay/UserInvitationPageAppQuery.graphql';
import Loader from '~ui/FeedbacksIndicators/Loader';

export type UserInvitationPageAppProps = {|
  +email: string,
  +logo: string,
  +token: string,
|};

type Props = UserInvitationPageAppProps;

export default (propsComponent: Props) => (
  <AlertBoxApp>
    <QueryRenderer
      environment={environment}
      query={graphql`
        query UserInvitationPageAppQuery {
          ...UserInvitationPage_query
        }
      `}
      variables={{}}
      render={({
        error,
        props,
      }: {
        ...ReactRelayReadyState,
        props: ?UserInvitationPageAppQueryResponse,
      }) => {
        if (error) return graphqlError;

        if (props) return <UserInvitationPage query={props} {...propsComponent} />;

        return <Loader />;
      }}
    />
  </AlertBoxApp>
);