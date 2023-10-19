// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  ChangeProposalDecisionMutationVariables,
  ChangeProposalDecisionMutationResponse,
} from '~relay/ChangeProposalDecisionMutation.graphql'

const mutation = graphql`
  mutation ChangeProposalDecisionMutation($input: ChangeProposalDecisionInput!) {
    changeProposalDecision(input: $input) {
      errorCode
      proposal {
        id
        ...ProposalPageBlog_proposal
        news {
          totalCount
          edges {
            node {
              ...AnswerBody_answer
              title
              authors {
                ... on User {
                  vip
                }
              }
            }
          }
        }
        decision {
          state
          estimatedCost
          refusedReason {
            label: name
            value: id
          }
          officialResponse {
            id
            body
            authors {
              value: id
              label: username
            }
          }
          isApproved
        }
        form {
          analysisConfiguration {
            effectiveDate
            unfavourableStatuses {
              value: id
              label: name
            }
          }
        }
      }
      decision {
        isApproved
        state
        refusedReason {
          id
        }
        proposal {
          id
          decision {
            estimatedCost
            officialResponse {
              id
              body
              authors {
                id
              }
            }
            id
            state
            decisionMaker {
              id
            }
            isApproved
          }
        }
        estimatedCost
        officialResponse {
          id
          body
          authors {
            id
          }
        }
      }
    }
  }
`

const commit = (variables: ChangeProposalDecisionMutationVariables): Promise<ChangeProposalDecisionMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
