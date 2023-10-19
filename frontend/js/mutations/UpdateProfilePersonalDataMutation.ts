// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  UpdateProfilePersonalDataMutationVariables,
  UpdateProfilePersonalDataMutationResponse as Response,
} from '~relay/UpdateProfilePersonalDataMutation.graphql'

export type UpdateProfilePersonalDataMutationResponse = Response
const mutation = graphql`
  mutation UpdateProfilePersonalDataMutation($input: UpdateProfilePersonalDataInput!) {
    updateProfilePersonalData(input: $input) {
      user {
        id
        ...PersonalData_viewer
        ...UserAdminPersonalData_user
      }
      errorCode
    }
  }
`

const commit = (variables: UpdateProfilePersonalDataMutationVariables): Promise<Response> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
