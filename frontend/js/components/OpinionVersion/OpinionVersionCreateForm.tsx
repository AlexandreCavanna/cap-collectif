import React from 'react'
import { FormattedMessage } from 'react-intl'
import { graphql, createFragmentContainer } from 'react-relay'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import renderInput from '../Form/Field'
import {
  startCreatingOpinionVersion,
  closeOpinionVersionCreateModal,
  cancelCreatingOpinionVersion,
} from '../../redux/modules/opinion'
import AddVersionMutation from '../../mutations/AddVersionMutation'
import type { State, Dispatch } from '../../types'
import type { OpinionVersionCreateForm_opinion } from '~relay/OpinionVersionCreateForm_opinion.graphql'

export const formName = 'opinion-version-create'
type FormValues = {
  body: string
  title: string
  comment: string
}
type RelayProps = {
  opinion: OpinionVersionCreateForm_opinion
}
type Props = RelayProps & {
  initialValues: FormValues
}

const onSubmit = (data: FormValues, dispatch: Dispatch, { opinion }: Props): Promise<any> => {
  dispatch(startCreatingOpinionVersion())
  const input = {
    opinionId: opinion.id,
    ...data,
  }
  return AddVersionMutation.commit({
    input,
  })
    .then(res => {
      if (res && res.addVersion && res.addVersion.versionEdge && res.addVersion.versionEdge.node) {
        window.location.href = res.addVersion.versionEdge.node.url
        dispatch(closeOpinionVersionCreateModal())
      }
    })
    .catch(() => {
      dispatch(cancelCreatingOpinionVersion())
    })
}

const validate = ({ body, title, comment }: FormValues, props: Props) => {
  const errors: any = {}

  if (body === props.initialValues.body) {
    errors.body = 'opinion.version.body_error'
  }

  if (title && title.length < 2) {
    errors.title = 'global.required'
  }

  if (comment) {
    if ($(comment).text().length < 2) {
      errors.comment = 'opinion.version.comment_error'
    }
  } else {
    errors.comment = 'global.required'
  }

  return errors
}

class OpinionVersionCreateForm extends React.Component<Props> {
  render() {
    return (
      <form>
        <Field name="title" type="text" component={renderInput} label={<FormattedMessage id="global.title" />} />
        <Field
          name="body"
          type="editor-ds"
          component={renderInput}
          label={<FormattedMessage id="opinion.version.body" />}
          help={<FormattedMessage id="opinion.version.body_helper" />}
        />
        <Field
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
    title: '',
    body: props.opinion.body,
    comment: '',
  },
})

// @ts-ignore
const container = connect(mapStateToProps)(
  reduxForm({
    form: formName,
    onSubmit,
    validate,
  })(OpinionVersionCreateForm),
)
export default createFragmentContainer(container, {
  opinion: graphql`
    fragment OpinionVersionCreateForm_opinion on Opinion {
      id
      body
    }
  `,
})
