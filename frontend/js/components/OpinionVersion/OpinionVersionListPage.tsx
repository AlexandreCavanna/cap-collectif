import * as React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment, { graphqlError } from '../../createRelayEnvironment'
import Loader from '../Ui/FeedbacksIndicators/Loader'
import type {
  OpinionVersionListPageQueryVariables,
  OpinionVersionListPageQueryResponse,
} from '~relay/OpinionVersionListPageQuery.graphql'
import UserOpinionVersionListViewPaginated from '../User/UserOpinionVersionListViewPaginated'
export type Props = {
  userId: string
}
export class OpinionVersionListPage extends React.Component<Props> {
  render() {
    const { userId } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query OpinionVersionListPageQuery($userId: ID!, $count: Int!, $cursor: String) {
            user: node(id: $userId) {
              ... on User {
                ...UserOpinionVersionListViewPaginated_user @arguments(cursor: $cursor, count: $count)
              }
            }
          }
        `}
        variables={
          {
            userId,
            cursor: null,
            count: 25,
          } as OpinionVersionListPageQueryVariables
        }
        render={({
          error,
          props,
        }: ReactRelayReadyState & {
          props?: OpinionVersionListPageQueryResponse | null | undefined
        }) => {
          if (error) {
            return graphqlError
          }

          if (props) {
            const { user } = props

            if (!user) {
              return graphqlError
            }

            return <UserOpinionVersionListViewPaginated userId={userId} user={props.user} />
          }

          return <Loader />
        }}
      />
    )
  }
}
export default OpinionVersionListPage
