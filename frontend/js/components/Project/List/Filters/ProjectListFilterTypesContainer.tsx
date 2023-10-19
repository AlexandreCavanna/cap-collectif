import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment, { graphqlError } from '../../../../createRelayEnvironment'
import type { ProjectListFilterTypesContainerQueryResponse } from '~relay/ProjectListFilterTypesContainerQuery.graphql'
import ProjectsListFilterTypes from './ProjectListFilterTypes'

type Props = {}
export default class ProjectsListFilterTypesContainer extends React.Component<Props> {
  renderProjectsListFilterTypes = ({
    error,
    props,
  }: ReactRelayReadyState & {
    props: ProjectListFilterTypesContainerQueryResponse | null | undefined
  }) => {
    if (error) {
      console.log(error) // eslint-disable-line no-console

      return graphqlError
    }

    if (props) {
      if (props.projectTypes) {
        const { projectTypes } = props

        if (projectTypes.length > 0) {
          return <ProjectsListFilterTypes projectTypes={projectTypes} formName="ProjectListFilters" />
        }
      }
    }

    return null
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query ProjectListFilterTypesContainerQuery($onlyUsedByProjects: Boolean!) {
            projectTypes(onlyUsedByProjects: $onlyUsedByProjects) {
              id
              title
              slug
            }
          }
        `}
        variables={{
          onlyUsedByProjects: true,
        }}
        render={this.renderProjectsListFilterTypes}
      />
    )
  }
}
