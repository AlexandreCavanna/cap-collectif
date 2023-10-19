// @ts-nocheck
import { graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  AddOpinionVoteMutationVariables,
  AddOpinionVoteMutationResponse,
} from '~relay/AddOpinionVoteMutation.graphql'

const mutation = graphql`
  mutation AddOpinionVoteMutation($input: AddOpinionVoteInput!) {
    addOpinionVote(input: $input) {
      previousVoteId
      voteEdge {
        cursor
        node {
          id
          ...OpinionUserVote_vote
          related {
            id
            ... on Opinion {
              viewerVote {
                id
                value
                ...UnpublishedTooltip_publishable
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
                ...UnpublishedTooltip_publishable
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
        }
      }
    }
  }
`

const commit = (variables: AddOpinionVoteMutationVariables): Promise<AddOpinionVoteMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
    configs: [
      // If the is previous vote, we remove it
      {
        type: 'RANGE_DELETE',
        parentID: variables.input.opinionId,
        connectionKeys: [
          {
            key: 'OpinionVotesBar_previewVotes',
          },
        ],
        pathToConnection: ['opinion', 'previewVotes'],
        deletedIDFieldName: 'previousVoteId',
      }, // Add the new vote
      {
        type: 'RANGE_ADD',
        parentID: variables.input.opinionId,
        connectionInfo: [
          {
            key: 'OpinionVotesBar_previewVotes',
            rangeBehavior: 'prepend',
          },
        ],
        edgeName: 'voteEdge',
      },
    ],
    updater: (store: any) => {
      const payload = store.getRootField('addOpinionVote')

      if (payload.getValue('previousVoteId')) {
        return
      }

      const opinionProxy = store.get(variables.input.opinionId)
      if (!opinionProxy) return
      const connection = ConnectionHandler.getConnection(opinionProxy, 'OpinionVotesBar_previewVotes')

      if (connection) {
        // @ts-expect-error argument 1 must be a int
        connection.setValue(connection.getValue('totalCount') + 1, 'totalCount')
      }
    },
  })

export default {
  commit,
}
