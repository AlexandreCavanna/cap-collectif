// @ts-nocheck
import { graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
// eslint-disable-next-line import/no-unresolved
import type { RecordSourceSelectorProxy } from 'relay-runtime/store/RelayStoreTypes'
import commitMutation from './commitMutation'
import environnement from '../createRelayEnvironment'
import type {
  UnfollowOpinionMutationVariables,
  UnfollowOpinionMutationResponse,
} from '~relay/UnfollowOpinionMutation.graphql'

const mutation = graphql`
  mutation UnfollowOpinionMutation($input: UnfollowOpinionInput!) {
    unfollowOpinion(input: $input) {
      opinion {
        __typename
        ... on Opinion {
          id
          ...OpinionFollowButton_opinion
          followers(first: 0) {
            totalCount
          }
        }
        ... on Version {
          id
          ...OpinionFollowButton_opinion
          followers(first: 0) {
            totalCount
          }
        }
      }
      unfollowerId
    }
  }
`

const decrementFollowerCount = (opinionId: string, store: RecordSourceSelectorProxy) => {
  const opinionProxy = store.get(opinionId)
  if (!opinionProxy) return
  const connection = ConnectionHandler.getConnection(
    opinionProxy,
    opinionProxy.getValue('__typename') === 'Opinion'
      ? 'OpinionFollowersBox_followers'
      : 'OpinionVersionFollowersBox_followers',
  )

  if (connection) {
    // @ts-expect-error argument 1 must be a int
    connection.setValue(connection.getValue('totalCount') - 1, 'totalCount')
  }
}

const commit = (variables: UnfollowOpinionMutationVariables): Promise<UnfollowOpinionMutationResponse> =>
  commitMutation(environnement, {
    mutation,
    variables,
    configs: [
      {
        type: 'RANGE_DELETE',
        // @ts-expect-error
        parentID: variables.input.opinionId || variables.input.idsOpinion[0] || '',
        connectionKeys: [
          {
            key: 'OpinionFollowersBox_followers',
          },
          {
            key: 'OpinionVersionFollowersBox_followers',
          },
        ],
        pathToConnection: ['opinion', 'followers'],
        deletedIDFieldName: 'unfollowerId',
      },
    ],
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('unfollowOpinion')

      if (!payload || !payload.getLinkedRecord('opinion')) {
        return
      }

      if (Array.isArray(variables.input.idsOpinion)) {
        variables.input.idsOpinion.map((id: string) => {
          decrementFollowerCount(id, store)
        })
      }

      if (typeof variables.input.opinionId === 'string') {
        decrementFollowerCount(variables.input.opinionId, store)
      }
    },
  })

export default {
  commit,
}
