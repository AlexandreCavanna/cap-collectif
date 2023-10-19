// @ts-nocheck
import { graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
// eslint-disable-next-line import/no-unresolved
import type { RecordSourceSelectorProxy } from 'relay-runtime/store/RelayStoreTypes'
import commitMutation from './commitMutation'
import environnement from '../createRelayEnvironment'
import type {
  FollowOpinionMutationVariables,
  FollowOpinionMutationResponse as Response,
} from '~relay/FollowOpinionMutation.graphql'

const mutation = graphql`
  mutation FollowOpinionMutation($input: FollowOpinionInput!) {
    followOpinion(input: $input) {
      opinion {
        __typename
        ... on Opinion {
          id
          ...OpinionFollowButton_opinion
        }
        ... on Version {
          id
          ...OpinionFollowButton_opinion
        }
      }
      followerEdge {
        node {
          id
          url
          displayName
          username
          contributionsCount
          isEmailConfirmed
          media {
            url
          }
        }
        cursor
      }
    }
  }
`

const commit = (variables: FollowOpinionMutationVariables): Promise<Response> =>
  commitMutation(environnement, {
    mutation,
    variables,
    configs: [
      {
        type: 'RANGE_ADD',
        parentID: variables.input.opinionId,
        connectionInfo: [
          {
            key: 'OpinionFollowersBox_followers',
            rangeBehavior: 'append',
          },
          {
            key: 'OpinionVersionFollowersBox_followers',
            rangeBehavior: 'append',
          },
        ],
        edgeName: 'followerEdge',
      },
    ],
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('followOpinion')

      if (!payload || !payload.getLinkedRecord('followerEdge')) {
        return
      }

      const opinionProxy = store.get(variables.input.opinionId)
      if (!opinionProxy) return
      const allFollowersProxy = opinionProxy.getLinkedRecord('followers', {
        first: 0,
      })
      if (!allFollowersProxy) return
      const previousValue = parseInt(allFollowersProxy.getValue('totalCount'), 10)
      allFollowersProxy.setValue(previousValue + 1, 'totalCount')
      const connection = ConnectionHandler.getConnection(
        opinionProxy,
        opinionProxy.getValue('__typename') === 'Opinion'
          ? 'OpinionFollowersBox_followers'
          : 'OpinionVersionFollowersBox_followers',
      )

      if (connection) {
        // @ts-expect-error argument 1 must be a int
        connection.setValue(connection.getValue('totalCount') + 1, 'totalCount')
      }
    },
  })

export default {
  commit,
}
