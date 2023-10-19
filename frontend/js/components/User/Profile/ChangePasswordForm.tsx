import React, { Component } from 'react'
import type { IntlShape } from 'react-intl'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { createFragmentContainer, graphql } from 'react-relay'
import { reduxForm, Field, SubmissionError } from 'redux-form'
import { Panel, ButtonToolbar, Button } from 'react-bootstrap'
import styled from 'styled-components'
import component from '../../Form/Field'
import AlertForm from '../../Alert/AlertForm'
import UpdateProfilePasswordMutation from '../../../mutations/UpdateProfilePasswordMutation'
import type { Dispatch, FeatureToggles, State } from '../../../types'
import { asyncPasswordValidate, CHANGE_PASSWORD_FORM_NAME as formName } from '../UserPasswordComplexityUtils'
import UserPasswordField from '../UserPasswordField'
import config from '../../../config'
import type { ChangePasswordForm_viewer } from '~relay/ChangePasswordForm_viewer.graphql'
import AppBox from '~ui/Primitives/AppBox'
type StateProps = {
  readonly features: FeatureToggles
}
type Props = StateProps &
  ReduxFormFormProps & {
    readonly viewer: ChangePasswordForm_viewer
    readonly intl: IntlShape
    readonly dispatch: Dispatch
  }
type FormValues = {
  email: string
  current_password: string
  new_password: string
  new_password_confirmation: string
}
const Container = styled.div`
  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .mtn-10 {
    margin-top: -10px;
  }

  .inline {
    display: block-inline;
  }

  .full-width {
    width: 100%;
  }
  .horizontal_field_with_border_top {
    .no-border {
      border: 0;
    }
  }
`

const onSubmit = (values: Record<string, any>, dispatch: Dispatch, { reset, intl }) => {
  if (!values.current_password) {
    throw new SubmissionError({
      current_password: intl.formatMessage({
        id: 'fos_user.password.not_current',
      }),
    })
  }

  if (!values.new_password && !values.new_password_confirmation) {
    throw new SubmissionError({
      new_password: intl.formatMessage({
        id: 'fos_user.new_password.blank',
      }),
    })
  }

  const input = {
    current_password: values.current_password,
    new_password: values.new_password,
  }
  return UpdateProfilePasswordMutation.commit({
    input,
  }).then(response => {
    if (
      !response.updateProfilePassword ||
      !response.updateProfilePassword.user ||
      response.updateProfilePassword.error
    ) {
      if (response.updateProfilePassword && response.updateProfilePassword.error) {
        throw new SubmissionError({
          current_password: response.updateProfilePassword.error,
        })
      } else {
        throw new SubmissionError({
          _error: intl.formatMessage({
            id: 'global.error.server.form',
          }),
        })
      }
    }

    reset()
  })
}

export class ChangePasswordForm extends Component<Props> {
  render() {
    const { invalid, valid, submitSucceeded, handleSubmit, submitting, error, features, viewer } = this.props
    const header = (
      <div className="panel-heading profile-header">
        <h1>
          <FormattedMessage id="modify-password" />
        </h1>
      </div>
    )
    const footer = (
      <div className="col-sm-offset-4">
        <Button disabled={invalid || submitting} type="submit" bsStyle="primary" id="profile-password-save">
          <FormattedMessage id={submitting ? 'global.loading' : 'global.save'} />
        </Button>
      </div>
    )
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <Panel id="capco_horizontal_form">
          <Panel.Heading>{header}</Panel.Heading>
          <Panel.Body>
            <Container>
              <div className="flex-column">
                {features.login_franceconnect && viewer.isFranceConnectAccount ? (
                  <AppBox
                    borderRadius={4}
                    borderColor="blue.200"
                    borderStyle="solid"
                    borderWidth="1px"
                    padding={4}
                    backgroundColor="blue.100"
                    mb={6}
                    color="blue.900"
                  >
                    <FormattedMessage id="mdp-fc" />
                  </AppBox>
                ) : null}
                <div className="no-border horizontal_field_with_border_top">
                  <label className="col-sm-3 control-label" htmlFor="password-form-current">
                    <FormattedMessage id="form.current_password" />
                  </label>
                  <div>
                    <Field
                      type="password"
                      component={component}
                      name="current_password"
                      id="password-form-current"
                      divClassName="col-sm-6"
                    />
                  </div>
                </div>

                <div className="mb-10 mtn-10">
                  <div className="col-sm-3" />
                  <a href="/resetting/request">
                    <FormattedMessage id="global.forgot_password" />
                  </a>
                </div>

                <div className="clearfix" />
                <div className="horizontal_field_with_border_top no-border">
                  <label className="col-sm-3 control-label" htmlFor="password-form-new">
                    <FormattedMessage id="new-password" />
                  </label>
                  <div>
                    <UserPasswordField
                      formName={formName}
                      id="password-form-new"
                      name="new_password"
                      divClassName={`col-sm-6 inline ${config.isMobile ? 'full-width' : ''}`}
                    />
                  </div>
                </div>
                <div className="clearfix" />
                <div className="horizontal_field_with_border_top no-border">
                  <label className="col-sm-3 control-label" htmlFor="password-form-confirmation">
                    <FormattedMessage id="confirm-password" />
                  </label>
                  <div>
                    <Field
                      type="password"
                      component={component}
                      name="new_password_confirmation"
                      id="password-form-confirmation"
                      divClassName="col-sm-6"
                    />
                  </div>
                </div>
                <div className="clearfix" />
                <div className="horizontal_field_with_border_top no-border">
                  <div className="col-sm-3" />
                  <ButtonToolbar className="col-sm-6 pl-0">
                    <AlertForm
                      valid={valid}
                      invalid={invalid}
                      errorMessage={error}
                      submitSucceeded={submitSucceeded}
                      submitFailed={false}
                      submitting={submitting}
                    />
                  </ButtonToolbar>
                </div>
              </div>
            </Container>
          </Panel.Body>
          <Panel.Footer>{footer}</Panel.Footer>
        </Panel>
      </form>
    )
  }
}
export const validate = (values: FormValues) => {
  const errors: any = {}

  if (!values.new_password && !values.new_password_confirmation) {
    return {}
  }

  if (!values.current_password || values.current_password.length < 1) {
    errors.current_password = 'fos_user.password.not_current'
  }

  if (!values.new_password || values.new_password.length < 1) {
    errors.new_password = 'at-least-8-characters-one-digit-one-uppercase-one-lowercase'
  }

  if (!values.new_password_confirmation || values.new_password_confirmation.length < 1) {
    errors.new_password_confirmation = 'fos_user.password.mismatch'
  }

  if (
    values.new_password &&
    values.new_password_confirmation &&
    values.new_password_confirmation !== values.new_password
  ) {
    errors.new_password_confirmation = 'fos_user.password.mismatch'
  }

  return errors
}

const asyncValidate = (values: FormValues, dispatch: Dispatch) => {
  if (!values.new_password && !values.new_password_confirmation) {
    return new Promise(resolve => {
      resolve()
    })
  }

  if (!values.new_password) {
    return new Promise((resolve, reject) => {
      const error: any = {}
      error.new_password = 'at-least-8-characters-one-digit-one-uppercase-one-lowercase'
      reject(error)
    })
  }

  return asyncPasswordValidate(formName, 'new_password', values, dispatch)
}

const form = reduxForm({
  onSubmit,
  validate,
  persistentSubmitErrors: false,
  asyncValidate,
  asyncChangeFields: ['new_password'],
  enableReinitialize: true,
  form: formName,
})(ChangePasswordForm)

const mapStateToProps = (state: State) => {
  return {
    features: state.default.features,
  }
}

// @ts-ignore
const container = connect<any, any>(mapStateToProps)(injectIntl(form))
export default createFragmentContainer(container, {
  viewer: graphql`
    fragment ChangePasswordForm_viewer on User {
      isFranceConnectAccount
    }
  `,
})
