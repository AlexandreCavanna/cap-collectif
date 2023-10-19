// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  CreateProjectAlphaMutationVariables,
  CreateProjectAlphaMutationResponse,
} from '~relay/CreateProjectAlphaMutation.graphql'

const mutation = graphql`
  mutation CreateProjectAlphaMutation($input: CreateAlphaProjectInput!) {
    createAlphaProject(input: $input) {
      project {
        _id
        id
        adminUrl
        steps {
          id
          body
          __typename
          title
          slug
          timeRange {
            startAt
            endAt
          }
        }
        ...ProjectContentAdminForm_project
        ...ProjectExternalAdminPage_project
        ...ProjectAccessAdminForm_project
        ...ProjectProposalsAdminForm_project
        ...ProjectPublishAdminForm_project
        ...ProjectContentAdminForm_project
        ...ProjectExternalAdminForm_project
      }
    }
  }
`

const commit = (variables: CreateProjectAlphaMutationVariables): Promise<CreateProjectAlphaMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
