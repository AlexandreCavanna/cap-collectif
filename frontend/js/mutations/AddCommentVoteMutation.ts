// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  AddCommentVoteMutationVariables,
  AddCommentVoteMutationResponse,
} from '~relay/AddCommentVoteMutation.graphql'

const mutation = graphql`
  mutation AddCommentVoteMutation($input: AddCommentVoteInput!) {
    addCommentVote(input: $input) {
      voteEdge {
        cursor
        node {
          id
          contribution {
            ...CommentVoteButton_comment
          }
        }
      }
    }
  }
`

const commit = (
  variables: AddCommentVoteMutationVariables,
  optimisticResponseVariables: Record<string, any>,
): Promise<AddCommentVoteMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
    optimisticResponse: {
      addCommentVote: {
        voteEdge: {
          cursor: 'tmpCommentVoteCursor',
          node: {
            id: 'tmpCommentVoteId',
            contribution: {
              id: variables.input.commentId,
              viewerHasVote: true,
              viewerVote: {
                id: 'tmpCommentVoteId',
                published: true,
                notPublishedReason: null,
              },
              votes: {
                totalCount: optimisticResponseVariables.votesCount + 1,
              },
            },
          },
        },
      },
    },
  })

export default {
  commit,
}
