import { $PropertyType } from 'utility-types'
import React from 'react'
import type { IntlShape } from 'react-intl'
import 'react-intl'
import { Field } from 'redux-form'
import select from '../../../Form/Select'
import type { ProjectListFiltersContainerQueryResponse } from '~relay/ProjectListFiltersContainerQuery.graphql'
type Props = {
  readonly district: string | null | undefined
  readonly intl: IntlShape
  readonly globalDistricts: $PropertyType<ProjectListFiltersContainerQueryResponse, 'globalDistricts'>
}
export default class ProjectsListFilterDistricts extends React.Component<Props> {
  render() {
    const { district, globalDistricts, intl } = this.props

    if (!globalDistricts.edges) {
      return null
    }

    const edges = globalDistricts.edges.filter(Boolean)

    if (edges.length > 0) {
      return (
        <Field
          id="project-district"
          componentClass="select"
          component={select}
          clearable
          type="select"
          name="district"
          value={district}
          placeholder={intl.formatMessage({
            id: 'global.select_districts',
          })}
          options={edges
            .map(edge => edge.node)
            .filter(Boolean)
            .map(node => ({
              value: node.id,
              label: node.name,
              ariaLabel: node.name,
            }))}
        />
      )
    }

    return null
  }
}
