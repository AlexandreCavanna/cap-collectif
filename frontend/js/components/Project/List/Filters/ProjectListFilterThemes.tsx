import React from 'react'
import type { IntlShape } from 'react-intl'
import 'react-intl'
import { Field } from 'redux-form'
import select from '../../../Form/Select'
import type { ProjectTheme } from './ProjectListFiltersContainer'
type Props = {
  readonly intl: IntlShape
  readonly theme: string | null | undefined
  readonly themes: ProjectTheme[]
}
export default class ProjectsListFilterThemes extends React.Component<Props> {
  render() {
    const { theme, themes, intl } = this.props

    if (themes.length > 0) {
      return (
        <Field
          id="project-theme"
          componentClass="select"
          component={select}
          clearable
          type="select"
          name="theme"
          value={theme}
          placeholder={intl.formatMessage({
            id: 'global.theme',
          })}
          options={themes.map(t => ({
            value: t.id,
            label: t.title,
            ariaLabel: t.title,
          }))}
        />
      )
    }

    return null
  }
}
