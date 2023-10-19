import React from 'react'
import { reduxForm } from 'redux-form'
import type { IntlShape } from 'react-intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import type { Dispatch } from '~/types'
import UserListField from '../../Admin/Field/UserListField'
import type { GroupAdminUsers_group } from '~relay/GroupAdminUsers_group.graphql'
import { groupAdminUsersUserDeletionReset } from '~/redux/modules/user'
import AddUsersInGroupMutation from '../../../mutations/AddUsersInGroupMutation'

type Props = {
  group: GroupAdminUsers_group
  handleSubmit: (...args: Array<any>) => any
  dispatch: Dispatch
  onClose: (...args: Array<any>) => any
  intl: IntlShape
}
type DefaultProps = void
type FormValues = {
  users: Array<Record<string, any>>
}
export const formName = 'group-users-add'

const validate = (values: FormValues) => {
  const errors: any = {}

  if (!values.users || values.users.length === 0) {
    errors.users = 'global.form.mandatory'
  }

  return errors
}

const onSubmit = (values: FormValues, dispatch: Dispatch, { group, onClose, reset }) => {
  const users = []
  dispatch(groupAdminUsersUserDeletionReset())
  values.users.map(user => {
    users.push(user.value)
  })
  const variables = {
    input: {
      users,
      groupId: group.id,
    },
  }
  return AddUsersInGroupMutation.commit(variables).then(() => {
    reset()
    onClose()
  })
}

export class GroupAdminAddUsersForm extends React.Component<Props> {
  static defaultProps: DefaultProps

  render() {
    const { handleSubmit, group, intl } = this.props
    const usersInGroup = []

    if (group.users.edges) {
      group.users.edges.map(edge => {
        if (edge && edge.node) {
          usersInGroup.push(edge.node.id)
        }
      })
    }

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <UserListField
            ariaControls="GroupAdminAddUsersForm-filter-user-listbox"
            id="group-users-users"
            name="users"
            label={<FormattedMessage id="group.admin.form.users" />}
            labelClassName="control-label"
            inputClassName="fake-inputClassName"
            placeholder={intl.formatMessage({
              id: 'select-a-user',
            })}
            userListToNoSearch={usersInGroup}
            multi
            autoload={false}
            clearable={false}
          />
        </div>
      </form>
    )
  }
}
const form = reduxForm({
  onSubmit,
  validate,
  form: formName,
  destroyOnUnmount: false,
})(GroupAdminAddUsersForm)
export default injectIntl(form)
