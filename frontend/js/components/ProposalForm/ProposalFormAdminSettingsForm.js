// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { createFragmentContainer, graphql } from 'react-relay';
import { ButtonToolbar, Button } from 'react-bootstrap';
import component from '../Form/Field';
import AlertForm from '../Alert/AlertForm';
import ChangeProposalFormParametersMutation from '../../mutations/ChangeProposalFormParametersMutation';
import type { ProposalFormAdminSettingsForm_proposalForm } from '~relay/ProposalFormAdminSettingsForm_proposalForm.graphql';
import type { State, Dispatch } from '../../types';

type RelayProps = {|
  isSuperAdmin: boolean,
  isAdmin: boolean,
  isOrganizationMember: boolean,
  proposalForm: ProposalFormAdminSettingsForm_proposalForm,
|};

type Props = {|
  intl: IntlShape,
  ...RelayProps,
  ...ReduxFormFormProps,
|};

const formName = 'proposal-form-admin-settings';
const validate = () => ({});

const onSubmit = (values: Object, dispatch: Dispatch, props: Props) => {
  const { proposalForm } = props;
  values.proposalFormId = proposalForm.id;
  delete values.id;
  return ChangeProposalFormParametersMutation.commit({
    input: values,
  });
};

export class ProposalFormAdminSettingsForm extends Component<Props> {
  render() {
    const {
      intl,
      invalid,
      isSuperAdmin,
      isOrganizationMember,
      isAdmin,
      pristine,
      handleSubmit,
      submitting,
      valid,
      submitSucceeded,
      submitFailed,
    } = this.props;

    return (
      <div className="box box-primary container-fluid mt-10">
        <div className="box-header">
          <h3 className="box-title">
            <FormattedMessage id="global.params" />
          </h3>
          <a
            className="pull-right link"
            rel="noopener noreferrer"
            href={intl.formatMessage({ id: 'admin.help.link.form.settings' })}>
            <i className="fa fa-info-circle" /> <FormattedMessage id="global.help" />
          </a>
        </div>
        <div className="box-content">
          <form onSubmit={handleSubmit}>
            <h4>
              <FormattedMessage id="global.general" />
            </h4>
            <Field
              name="title"
              label={<FormattedMessage id="global.title" />}
              component={component}
              type="text"
              id="global.title"
            />
            <h4>
              <FormattedMessage id="global.options" />
            </h4>
            {(isAdmin || isSuperAdmin || isOrganizationMember) && (
              <Field
                name="commentable"
                component={component}
                type="checkbox"
                id="proposal_form_commentable">
                <FormattedMessage id="proposal_form.commentable" />
              </Field>
            )}
            {isSuperAdmin && (
              <Field
                name="suggestingSimilarProposals"
                component={component}
                type="checkbox"
                id="proposal_form_suggestingSimilarProposals">
                <FormattedMessage id="proposal_form.suggestingSimilarProposals" />
              </Field>
            )}
            <Field
              name="costable"
              component={component}
              type="checkbox"
              id="proposal_form_costable">
              <FormattedMessage id="proposal_form.costable" />
            </Field>
            <ButtonToolbar className="box-content__toolbar">
              <Button
                disabled={invalid || pristine || submitting}
                id="parameters-submit"
                type="submit"
                bsStyle="primary">
                <FormattedMessage id={submitting ? 'global.loading' : 'global.save'} />
              </Button>
              <Button bsStyle="danger" disabled>
                <FormattedMessage id="global.delete" />
              </Button>
              <AlertForm
                valid={valid}
                invalid={invalid}
                submitSucceeded={submitSucceeded}
                submitFailed={submitFailed}
                submitting={submitting}
              />
            </ButtonToolbar>
          </form>
        </div>
      </div>
    );
  }
}
const form = reduxForm({
  onSubmit,
  validate,
  enableReinitialize: true,
  form: formName,
})(ProposalFormAdminSettingsForm);

const mapStateToProps = (state: State, props: RelayProps) => {
  const { proposalForm } = props;
  return {
    isSuperAdmin: !!(state.user.user && state.user.user.roles.includes('ROLE_SUPER_ADMIN')),
    isAdmin: !!(state.user.user && state.user.user.roles.includes('ROLE_ADMIN')),
    isOrganizationMember: state?.user?.user?.isOrganizationMember ?? false,
    initialValues: {
      title: proposalForm.title,
      commentable: proposalForm.commentable,
      costable: proposalForm.costable,
      suggestingSimilarProposals: proposalForm.suggestingSimilarProposals,
    },
  };
};

const container = connect<any, any, _, _, _, _>(mapStateToProps)(form);
const containerIntl = injectIntl(container);

export default createFragmentContainer(containerIntl, {
  proposalForm: graphql`
    fragment ProposalFormAdminSettingsForm_proposalForm on ProposalForm {
      id
      title
      commentable
      costable
      suggestingSimilarProposals
    }
  `,
});
