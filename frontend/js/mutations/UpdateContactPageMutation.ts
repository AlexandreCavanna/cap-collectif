// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  UpdateContactPageMutationVariables,
  UpdateContactPageMutationResponse,
} from '~relay/UpdateContactPageMutation.graphql'

const mutation = graphql`
  mutation UpdateContactPageMutation($input: UpdateContactPageInput!) {
    updateContactPage(input: $input) {
      title
      description
      metadescription
      customcode
      picto {
        id
      }
    }
  }
`

const commit = (variables: UpdateContactPageMutationVariables): Promise<UpdateContactPageMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
