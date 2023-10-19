// @ts-nocheck
import { graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type {
  UpdateQuestionnaireConfigurationMutationVariables,
  UpdateQuestionnaireConfigurationMutationResponse,
} from '~relay/UpdateQuestionnaireConfigurationMutation.graphql'

const mutation = graphql`
  mutation UpdateQuestionnaireConfigurationMutation(
    $input: UpdateQuestionnaireConfigurationInput!
    $questionnaireResultsEnabled: Boolean!
  ) {
    updateQuestionnaireConfiguration(input: $input) {
      questionnaire {
        ...QuestionnaireAdminConfigurationForm_questionnaire
        ...QuestionnaireAdminResults_questionnaire @include(if: $questionnaireResultsEnabled)
      }
    }
  }
`

const commit = (
  variables: UpdateQuestionnaireConfigurationMutationVariables,
): Promise<UpdateQuestionnaireConfigurationMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  })

export default {
  commit,
}
