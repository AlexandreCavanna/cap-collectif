// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  ChangeMapStyleMutationVariables,
  ChangeMapStyleMutationResponse as Response,
} from '~relay/ChangeMapStyleMutation.graphql'

export type ChangeMapStyleMutationResponse = Response
const mutation = graphql`
  mutation ChangeMapStyleMutation($input: ChangeMapStyleInput!) {
    changeMapStyle(input: $input) {
      mapToken {
        ...MapboxAdminConfig_mapToken
      }
    }
  }
`

const commit = (variables: ChangeMapStyleMutationVariables): Promise<Response> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
