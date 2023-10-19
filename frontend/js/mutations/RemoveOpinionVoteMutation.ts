// @ts-nocheck
import { graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  RemoveOpinionVoteMutationVariables,
  RemoveOpinionVoteMutationResponse,
} from '~relay/RemoveOpinionVoteMutation.graphql'

const mutation = graphql`
  mutation RemoveOpinionVoteMutation($input: RemoveOpinionVoteInput!) {
    removeOpinionVote(input: $input) {
      deletedVoteId
      contribution {
        id
        ... on Opinion {
          viewerVote {
            id
            value
          }
          votes(first: 0) {
            totalCount
          }
          votesOk: votes(first: 0, value: YES) {
            totalCount
          }
          votesNok: votes(first: 0, value: NO) {
            totalCount
          }
          votesMitige: votes(first: 0, value: MITIGE) {
            totalCount
          }
        }
        ... on Version {
          viewerVote {
            id
            value
          }
          votes(first: 0) {
            totalCount
          }
          votesOk: votes(first: 0, value: YES) {
            totalCount
          }
          votesNok: votes(first: 0, value: NO) {
            totalCount
          }
          votesMitige: votes(first: 0, value: MITIGE) {
            totalCount
          }
        }
      }
      viewer {
        id
      }
    }
  }
`

const commit = (variables: RemoveOpinionVoteMutationVariables): Promise<RemoveOpinionVoteMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
    configs: [
      {
        type: 'RANGE_DELETE',
        parentID: variables.input.opinionId,
        connectionKeys: [
          {
            key: 'OpinionVotesBar_previewVotes',
          },
        ],
        pathToConnection: ['opinion', 'previewVotes'],
        deletedIDFieldName: 'deletedVoteId',
      },
    ],
    updater: (store: any) => {
      const opinionProxy = store.get(variables.input.opinionId)
      if (!opinionProxy) return
      const connection = ConnectionHandler.getConnection(opinionProxy, 'OpinionVotesBar_previewVotes')

      if (connection) {
        // @ts-expect-error argument 1 must be a int
        connection.setValue(connection.getValue('totalCount') - 1, 'totalCount')
      }
    },
  })

export default {
  commit,
}
