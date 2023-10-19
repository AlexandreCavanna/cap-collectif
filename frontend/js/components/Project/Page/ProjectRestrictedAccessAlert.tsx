import React from 'react'
import { Alert } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { QueryRenderer, graphql } from 'react-relay'
import environment, { graphqlError } from '../../../createRelayEnvironment'
import type { ProjectRestrictedAccessAlertQueryResponse } from '~relay/ProjectRestrictedAccessAlertQuery.graphql'
import '~relay/ProjectRestrictedAccessAlertQuery.graphql'

const query = graphql`
  query ProjectRestrictedAccessAlertQuery($id: ID!) {
    project: node(id: $id) {
      ... on Project {
        visibility
        adminAlphaUrl
      }
    }
  }
`
type Props = {
  projectId: string
}
export const rendering = ({
  error,
  props,
}: ReactRelayReadyState & {
  props?: ProjectRestrictedAccessAlertQueryResponse | null | undefined
}) => {
  if (error) {
    return graphqlError
  }

  if (props) {
    if (props.project != null && props.project.visibility != null) {
      if (props.project.visibility !== 'PUBLIC' && props.project.visibility !== 'CUSTOM') {
        const alertText =
          props.project.visibility === 'ME' ? 'global.draft.only_visible_by_you' : 'only-visible-by-administrators'
        const { project } = props
        return (
          <Alert
            className="alert-dismissible text-center"
            bsStyle="warning"
            style={{
              marginBottom: '0',
            }}
          >
            <i className="cap cap-lock-2 mr-1" />
            <FormattedMessage id={alertText} />
            <a
              id="action_show"
              className="ml-15 btn btn-sm btn-warning"
              href={project.adminAlphaUrl != null ? project.adminAlphaUrl : ''}
              name="action_edit"
            >
              <FormattedMessage id="action_edit" />
              <i className="cap cap-external-link ml-5" />
            </a>
          </Alert>
        )
      }
    }
  }

  return null
}
export class ProjectRestrictedAccessAlert extends React.Component<Props> {
  render() {
    const { projectId } = this.props
    return (
      <div>
        <QueryRenderer
          environment={environment}
          query={query}
          variables={{
            id: projectId,
          }}
          render={rendering}
        />
      </div>
    )
  }
}
export default ProjectRestrictedAccessAlert
