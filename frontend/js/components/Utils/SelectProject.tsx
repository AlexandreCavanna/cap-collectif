import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import { Field } from 'redux-form'
import select from '../Form/Select'
import type { SelectProject_query } from '~relay/SelectProject_query.graphql'
type Props = {
  readonly query: SelectProject_query
  readonly intl: IntlShape
  readonly multi: boolean
  readonly clearable: boolean
  readonly name: string
  readonly label: string
  readonly optional: boolean
  readonly placeholder?: string
  readonly disabled: boolean
}

const renderLabel = (intl: IntlShape, label: string, optional: boolean) => {
  const message = intl.formatMessage({
    id: label,
  })
  return optional ? (
    <div>
      {message}
      <div className="excerpt inline">
        {intl.formatMessage({
          id: 'global.optional',
        })}
      </div>
    </div>
  ) : (
    message
  )
}

export class SelectProject extends React.Component<Props> {
  static defaultProps = {
    multi: false,
    clearable: false,
    name: 'project',
    label: 'global.project',
    optional: false,
    disabled: false,
  }

  render() {
    const { query, intl, multi, clearable, name, label, optional, disabled, placeholder } = this.props
    const renderSelectedOption =
      query && query.projects && query.projects.edges
        ? query.projects.edges
            .filter(Boolean)
            .map(edge => edge.node)
            .filter(Boolean)
            .map(node => ({
              value: node.id,
              label: node.title,
            }))
        : []
    return (
      <div>
        <Field
          component={select}
          id="SelectProject-filter-project"
          name={name}
          placeholder={intl.formatMessage({
            id: placeholder ?? 'global.all.projects',
          })}
          label={renderLabel(intl, label, optional)}
          options={renderSelectedOption}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="true"
          aria-controls="SelectProject-filter-project-listbox"
          multi={multi}
          clearable={clearable}
          disabled={disabled}
        />
      </div>
    )
  }
}
const container = injectIntl(SelectProject)
export default createFragmentContainer(container, {
  query: graphql`
    fragment SelectProject_query on Query
    @argumentDefinitions(withEventOnly: { type: "Boolean", defaultValue: false }) {
      projects(withEventOnly: $withEventOnly) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
})
