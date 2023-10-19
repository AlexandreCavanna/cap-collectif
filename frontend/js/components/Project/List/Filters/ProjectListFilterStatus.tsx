import React from 'react'
import type { IntlShape } from 'react-intl'
import 'react-intl'
import { Field } from 'redux-form'
import select from '../../../Form/Select'
import type { ProjectType } from '../../../../constants/ProjectStatusConstants'
import { PROJECT_STATUSES } from '../../../../constants/ProjectStatusConstants'

type Props = {
  intl: IntlShape
  status: string | null | undefined
}
export default class ProjectsListFilterStatus extends React.Component<Props> {
  render() {
    const { status, intl } = this.props
    const statuses: ProjectType[] = PROJECT_STATUSES

    if (statuses.length > 0) {
      return (
        <Field
          id="project-status"
          componentClass="select"
          component={select}
          clearable
          type="select"
          name="status"
          value={status}
          placeholder={intl.formatMessage({
            id: 'global.status',
          })}
          options={statuses.map(s => ({
            value: s.id,
            label: intl.formatMessage({
              id: s.title,
            }),
          }))}
        />
      )
    }

    return null
  }
}
