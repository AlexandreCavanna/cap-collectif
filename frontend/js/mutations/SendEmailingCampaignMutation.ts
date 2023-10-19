// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  SendEmailingCampaignMutationVariables,
  SendEmailingCampaignMutationResponse,
} from '~relay/SendEmailingCampaignMutation.graphql'

const mutation = graphql`
  mutation SendEmailingCampaignMutation($input: SendEmailingCampaignInput!) {
    sendEmailingCampaign(input: $input) {
      error
      emailingCampaign {
        id
        status
        sendAt
      }
    }
  }
`

const commit = (variables: SendEmailingCampaignMutationVariables): Promise<SendEmailingCampaignMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
