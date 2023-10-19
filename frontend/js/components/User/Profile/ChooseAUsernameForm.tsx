import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import component from '../../Form/Field'
import UpdateUsernameMutation from '~/mutations/UpdateUsernameMutation'
import { REGEX_USERNAME } from '~/constants/FormConstants'

export const formName = 'choose-username'

const onSubmit = (values: Record<string, any>) =>
  UpdateUsernameMutation.commit({
    input: {
      username: values.username,
    },
  }).then(() => {
    window.location.reload()
    return true
  })

const validate = ({ username }: { username: string | null | undefined }) => {
  const errors: any = {}

  if (!username || username.length < 2) {
    errors.username = 'registration.constraints.username.min'
  }

  if (username && !REGEX_USERNAME.test(username)) {
    errors.username = 'registration.constraints.username.symbol'
  }

  return errors
}

export const ChooseAUsernameForm = ({ handleSubmit }: ReduxFormFormProps) => (
  <form onSubmit={handleSubmit}>
    <Field
      type="text"
      component={component}
      name="username"
      id="account__username"
      help={
        <span>
          <FormattedMessage id="name-under-which-you-will-appear-on-the-site" />
        </span>
      }
      label={<FormattedMessage id="global.fullname" />}
    />
  </form>
)
export default reduxForm({
  form: formName,
  validate,
  onSubmit,
})(ChooseAUsernameForm)
