import React, { Component } from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import { connect } from 'react-redux'
import environment, { graphqlError } from '../../createRelayEnvironment'
import QuestionnaireAdminPageTabs from './QuestionnaireAdminPageTabs'
import Loader from '../Ui/FeedbacksIndicators/Loader'
import type { QuestionnaireAdminPageQueryResponse } from '~relay/QuestionnaireAdminPageQuery.graphql'
import type { Uuid, GlobalState } from '../../types'

export type Props = {
  enableResultsTab: boolean
  questionnaireId: Uuid
}

const component = ({
  error,
  props,
  retry,
}: ReactRelayReadyState & {
  props: QuestionnaireAdminPageQueryResponse | null | undefined
}) => {
  if (error) {
    console.log(error) // eslint-disable-line no-console

    return graphqlError
  }

  if (props) {
    if (props.questionnaire && props.viewer) {
      if (!props.questionnaire.isIndexationDone) {
        if (retry) {
          setTimeout(() => {
            retry()
          }, 5000)
        }

        return <Loader />
      }

      const { questionnaire, viewer } = props
      return <QuestionnaireAdminPageTabs questionnaire={questionnaire} viewer={viewer} />
    }

    return graphqlError
  }

  return <Loader />
}

export class QuestionnaireAdminPage extends Component<Props> {
  render() {
    const { enableResultsTab, questionnaireId } = this.props
    return (
      <div className="admin_questionnaire_form">
        <QueryRenderer
          environment={environment}
          query={graphql`
            query QuestionnaireAdminPageQuery($id: ID!, $enableResultsTab: Boolean!) {
              questionnaire: node(id: $id) {
                ...QuestionnaireAdminPageTabs_questionnaire
                ... on Questionnaire {
                  isIndexationDone
                }
              }
              viewer {
                ...QuestionnaireAdminPageTabs_viewer
              }
            }
          `}
          variables={{
            id: questionnaireId,
            enableResultsTab,
          }}
          render={component}
        />
      </div>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  enableResultsTab: state.default.features.questionnaire_result,
})

export default connect<any, any>(mapStateToProps)(QuestionnaireAdminPage)
