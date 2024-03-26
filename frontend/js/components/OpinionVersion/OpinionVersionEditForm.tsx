import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import ChangeVersionMutation from '../../mutations/ChangeVersionMutation'
import { closeOpinionVersionEditModal } from '../../redux/modules/opinion'
import renderInput from '../Form/Field'
import type { State } from '../../types'
import type { OpinionVersionEditForm_version } from '~relay/OpinionVersionEditForm_version.graphql'
import { isHTML } from '../../utils/isHtml'

export const formName = 'opinion-version-edit'
type RelayProps = {
  version: OpinionVersionEditForm_version
}
type FormValues = {
  confirm: boolean
  title: string
  comment: string
  body: string
}
type Props = RelayProps

const onSubmit = (values: FormValues, dispatch, props: Props) => {
  const input = {
    versionId: props.version.id,
    body: values.body,
    title: values.title,
    comment: values.comment,
  }
  return ChangeVersionMutation.commit({
    input,
  }).then(() => {
    dispatch(closeOpinionVersionEditModal())
  })
}

const validate = ({ confirm, title, comment }: FormValues) => {
  const errors: any = {}

  if (!confirm) {
    errors.confirm = 'global.required'
  }

  if (title) {
    if (title.length <= 2) {
      errors.title = 'opinion.version.title_error'
    }
  } else {
    errors.title = 'global.required'
  }

  if (comment) {
    if (!isHTML(comment) || $(comment).text().length < 2) {
      errors.comment = 'opinion.version.comment_error'
    }
  } else {
    errors.comment = 'global.required'
  }

  return errors
}

class OpinionVersionEditForm extends React.Component<Props> {
  render() {
    return (
      <form id="opinion-version-edit">
        <div className="alert alert-warning edit-confirm-alert">
          <Field
            type="checkbox"
            wrapperClassName="checkbox"
            name="confirm"
            id="confirm-opinion-version"
            component={renderInput}
          >
            <FormattedMessage id="opinion.version.confirm" />
          </Field>
        </div>
        <Field name="title" type="text" component={renderInput} label={<FormattedMessage id="global.title" />} />
        <Field
          id="version-body"
          name="body"
          type="editor-ds"
          component={renderInput}
          label={<FormattedMessage id="opinion.version.body" />}
          help={<FormattedMessage id="opinion.version.body_helper" />}
        />
        <Field
          id="version-comment"
          name="comment"
          type="editor-ds"
          component={renderInput}
          label={<FormattedMessage id="opinion.version.comment" />}
          help={<FormattedMessage id="opinion.version.comment_helper" />}
        />
      </form>
    )
  }
}

const mapStateToProps = (state: State, props: RelayProps) => ({
  initialValues: {
    title: props.version.title,
    body: props.version.body,
    comment: props.version.comment,
  },
})

// @ts-ignore
const container = connect(mapStateToProps)(
  reduxForm({
    form: formName,
    onSubmit,
    validate,
  })(OpinionVersionEditForm),
)
export default createFragmentContainer(container, {
  version: graphql`
    fragment OpinionVersionEditForm_version on Version {
      id
      title
      body
      comment
    }
  `,
})
