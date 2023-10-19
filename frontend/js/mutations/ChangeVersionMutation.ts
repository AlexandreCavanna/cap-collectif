// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  ChangeVersionMutationVariables,
  ChangeVersionMutationResponse,
} from '~relay/ChangeVersionMutation.graphql'

const mutation = graphql`
  mutation ChangeVersionMutation($input: ChangeVersionInput!) {
    changeVersion(input: $input) {
      version {
        id
        ...OpinionBody_opinion
        ...OpinionVersion_version
        ...OpinionVersionEditForm_version
      }
    }
  }
`

const commit = (variables: ChangeVersionMutationVariables): Promise<ChangeVersionMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
