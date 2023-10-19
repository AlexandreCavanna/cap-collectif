import * as React from 'react'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import renderComponent from '../../Form/Field'
import type { Props as ContactAdminPageProps } from './ContactAdminPage'
type Props = ReduxFormFormProps &
  ContactAdminPageProps & {
    readonly formName: string
  }

const ContactAdminForm = (props: Props): React.ReactElement<'form'> => {
  const { formName, handleSubmit } = props
  const optional = (
    <span className="excerpt">
      <FormattedMessage id="global.optional" />
    </span>
  )
  return (
    <form onSubmit={handleSubmit} id={formName}>
      <Field
        type="text"
        name="title"
        label={<FormattedMessage id="global.title" />}
        helpPrint={false}
        component={renderComponent}
      />
      <Field
        name="description"
        type="admin-editor"
        component={renderComponent}
        label={
          <span>
            <FormattedMessage id="proposal.body" />
            {optional}
          </span>
        }
      />
    </form>
  )
}

export default ContactAdminForm
