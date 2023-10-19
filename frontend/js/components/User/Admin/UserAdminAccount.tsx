import * as React from 'react'
import type { IntlShape } from 'react-intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { SubmissionError, reduxForm, Field } from 'redux-form'
import { createFragmentContainer, graphql } from 'react-relay'
import { ButtonToolbar, Button } from 'react-bootstrap'
import component from '../../Form/Field'
import AlertForm from '../../Alert/AlertForm'
import type { GlobalState, Dispatch } from '../../../types'
import UpdateUserAccountMutation from '../../../mutations/UpdateUserAccountMutation'
import type { UserAdminAccount_user } from '~relay/UserAdminAccount_user.graphql'
import type { UserAdminAccount_viewer } from '~relay/UserAdminAccount_viewer.graphql'
import type { UserRole } from '~relay/UpdateUserAccountMutation.graphql'
import DeleteAccountModal from '../DeleteAccountModal'
import SelectUserRole from '../../Form/SelectUserRole'
import DatesInterval from '../../Utils/DatesInterval'
type FormValues = {
  readonly roles: {
    readonly labels: ReadonlyArray<UserRole>
    readonly other: string | null | undefined
  }
  readonly vip: boolean
  readonly enabled: boolean
  readonly locked: boolean
  readonly newsletter: boolean
  readonly isSubscribedToProposalNews: boolean
}
type RelayProps = {
  readonly user: UserAdminAccount_user
  readonly viewer: UserAdminAccount_viewer
}
type AfterConnectProps = RelayProps & {
  readonly isViewerOrAdmin: boolean
  readonly initialValues: FormValues
  readonly dispatch: Dispatch
}
type Props = ReduxFormFormProps &
  AfterConnectProps & {
    readonly intl: IntlShape
  }
const formName = 'user-admin-edit-account'

const onSubmit = (values: FormValues, dispatch: Dispatch, { user }: Props) => {
  const roles = values.roles.labels
  const { vip } = values
  const { enabled } = values
  const { locked } = values
  const input = {
    vip,
    locked,
    enabled,
    roles,
    userId: user.id,
    subscribedToProposalNews: user.isAdmin ? values.isSubscribedToProposalNews : undefined,
  }
  return UpdateUserAccountMutation.commit({
    input,
  })
    .then(response => {
      if (!response.updateUserAccount || !response.updateUserAccount.user) {
        throw new Error('Mutation "updateUserAccount" failed.')
      }
    })
    .catch(() => {
      throw new SubmissionError({
        _error: 'global.error.server.form',
      })
    })
}

const validate = (values: FormValues | null | undefined) => {
  const errors: any = {}

  if (values && values.roles && values.roles.labels.length === 0) {
    errors.roles = '1-option-minimum'
  }

  return errors
}

type State = {
  readonly showDeleteAccountModal: boolean
}
export class UserAdminAccount extends React.Component<Props, State> {
  state = {
    showDeleteAccountModal: false,
  }

  render() {
    const {
      pristine,
      invalid,
      valid,
      submitSucceeded,
      submitFailed,
      user,
      submitting,
      handleSubmit,
      isViewerOrAdmin,
      viewer,
    } = this.props
    const { showDeleteAccountModal } = this.state
    return (
      <div className="box box-primary container-fluid">
        <div className="box-header">
          <h2 className="box-title">
            <FormattedMessage id="user.profile.edit.account" />
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage id="admin.fields.step.group_statuses" />
            </h3>
          </div>
          <div className="box-content box-content__content-form">
            <Field name="vip" component={component} type="checkbox" id="vip">
              <FormattedMessage id="form.label_vip" />
            </Field>
            <Field name="enabled" component={component} type="checkbox" id="enabled">
              <FormattedMessage id="form.label_enabled" />
            </Field>
            <Field name="locked" component={component} type="checkbox" id="locked">
              <FormattedMessage id="form.label_locked" />
            </Field>
            <div className="box-header">
              <h3 className="box-title">
                <FormattedMessage id="form.label_real_roles" />
              </h3>
            </div>
            <SelectUserRole id="user_roles" name="roles" label="form.label_real_roles" />
            <div className="box-header">
              <h3 className="box-title">
                <FormattedMessage id="subscription" />
              </h3>
            </div>
            <Field id="newsletter" name="newsletter" component={component} type="checkbox" disabled={!user.isViewer}>
              <div>
                <FormattedMessage id="newsletter" /> <DatesInterval startAt={user.subscribedToNewsLetterAt} />
              </div>
            </Field>
            {user.isAdmin && (
              <Field
                id="isSubscribedToProposalNews"
                name="isSubscribedToProposalNews"
                component={component}
                type="checkbox"
                disabled={!user.isViewer}
              >
                <FormattedMessage id="proposals-actualities" />
              </Field>
            )}
            <ButtonToolbar className="box-content__toolbar">
              <Button
                type="submit"
                id="user_admin_account_save"
                bsStyle="primary"
                disabled={pristine || invalid || submitting}
              >
                <FormattedMessage id={submitting ? 'global.loading' : 'global.save'} />
              </Button>
              {((isViewerOrAdmin && !user.isSuperAdmin) || viewer.isSuperAdmin) && (
                <Button
                  id="delete-account-profile-button"
                  bsStyle="danger"
                  onClick={() => {
                    this.setState({
                      showDeleteAccountModal: true,
                    })
                  }}
                  style={{
                    marginLeft: 15,
                  }}
                >
                  <FormattedMessage id="global.delete" />
                </Button>
              )}
              <AlertForm
                valid={valid}
                invalid={invalid}
                submitSucceeded={submitSucceeded}
                submitFailed={submitFailed}
                submitting={submitting}
              />
            </ButtonToolbar>
            {isViewerOrAdmin && (
              <DeleteAccountModal
                viewer={user}
                userDeletedIsNotViewer={!user.isViewer}
                show={showDeleteAccountModal}
                handleClose={() => {
                  this.setState({
                    showDeleteAccountModal: false,
                  })
                }}
              />
            )}
          </div>
        </form>
      </div>
    )
  }
}
const form = reduxForm({
  onSubmit,
  validate,
  enableReinitialize: false,
  form: formName,
})(UserAdminAccount)

const mapStateToProps = (state: GlobalState, { user, viewer }: RelayProps) => ({
  initialValues: {
    vip: user.vip,
    enabled: user.enabled,
    locked: user.locked,
    roles: {
      labels: user.roles,
      other: null,
    },
    newsletter: user.isSubscribedToNewsLetter,
    isSubscribedToProposalNews: user.isSubscribedToProposalNews,
  },
  isViewerOrAdmin: user.isViewer || viewer.isAdmin,
})
// @ts-ignore
const container = connect<AfterConnectProps, RelayProps, _, _, _, _>(mapStateToProps)(injectIntl(form))
export default createFragmentContainer(container, {
  user: graphql`
    fragment UserAdminAccount_user on User {
      id
      isViewer
      roles
      locked
      vip
      enabled
      isAdmin
      isSuperAdmin
      isSubscribedToNewsLetter
      isSubscribedToProposalNews
      subscribedToNewsLetterAt
      ...DeleteAccountModal_viewer
    }
  `,
  viewer: graphql`
    fragment UserAdminAccount_viewer on User {
      isAdmin
      isSuperAdmin
    }
  `,
})
