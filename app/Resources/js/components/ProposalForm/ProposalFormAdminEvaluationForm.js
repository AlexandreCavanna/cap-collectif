// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { createFragmentContainer, graphql } from 'react-relay';
import { ButtonToolbar, Button } from 'react-bootstrap';
import type { Dispatch, State } from '../../types';
import component from '../Form/Field';
import type { ProposalFormAdminEvaluationForm_proposalForm } from './__generated__/ProposalFormAdminEvaluationForm_proposalForm.graphql';
import SetEvaluationFormInProposalFormMutation from '../../mutations/SetEvaluationFormInProposalFormMutation';

type RelayProps = { proposalForm: ProposalFormAdminEvaluationForm_proposalForm };
type Props = RelayProps & {
  handleSubmit: () => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
};

type DefaultProps = void;
type FormValues = Object;

export const formName = 'proposal-form-admin-evaluation';

const onSubmit = (values: FormValues, dispatch: Dispatch, { proposalForm }: Props) => {
  const evaluationFormId = values.evaluationForm;
  const proposalFormId = proposalForm.id;

  const input = {
    proposalFormId,
    evaluationFormId,
  };

  return SetEvaluationFormInProposalFormMutation.commit({ input }).then(() => {
    location.reload();
  });
};

export class ProposalFormAdminEvaluationForm extends React.Component<Props> {
  static defaultProps: DefaultProps;

  render() {
    const { proposalForm, handleSubmit, pristine, submitting, invalid } = this.props;

    return (
      <div className="box box-primary container">
        <div className="box-header">
          <h3
            className="box-title"
            style={{ fontSize: 22, padding: 0, paddingTop: 10, paddingBottom: 30 }}>
            {<FormattedMessage id="proposal_form.evaluation" />}
          </h3>
          <a
            className="pull-right link"
            rel="noopener noreferrer"
            href="https://aide.cap-collectif.com/article/51-creer-un-formulaire-de-depot">
            <i className="fa fa-info-circle" /> Aide
          </a>
        </div>
        <form onSubmit={handleSubmit}>
          <Field
            name="evaluationForm"
            component={component}
            type="select"
            id="evaluation-form"
            label={<FormattedMessage id="proposal_form.evaluation_form" />}>
            <FormattedMessage id="proposal_form.select_evaluation_form">
              {message => <option value="">{message}</option>}
            </FormattedMessage>
            {proposalForm.evaluationForms &&
              proposalForm.evaluationForms.map(evaluationForm => (
                <option key={evaluationForm.id} value={evaluationForm.id}>
                  {evaluationForm.title}
                </option>
              ))}
          </Field>
          <ButtonToolbar style={{ marginBottom: 10 }}>
            <Button disabled={invalid || pristine || submitting} type="submit" bsStyle="primary">
              <FormattedMessage id={submitting ? 'global.loading' : 'global.save'} />
            </Button>
            <Button bsStyle="danger" disabled>
              <FormattedMessage id="global.delete" />
            </Button>
          </ButtonToolbar>
        </form>
      </div>
    );
  }
}

const form = reduxForm({
  onSubmit,
  form: formName,
})(ProposalFormAdminEvaluationForm);

const selector = formValueSelector(formName);

const mapStateToProps = (state: State, props: RelayProps) => ({
  initialValues: {
    ...props.proposalForm,
    evaluationForm: props.proposalForm.evaluationForm ? props.proposalForm.evaluationForm.id : null,
  },
  evaluationForm: selector(state, 'evaluationForm'),
});

const container = connect(mapStateToProps)(form);

export default createFragmentContainer(
  container,
  graphql`
    fragment ProposalFormAdminEvaluationForm_proposalForm on ProposalForm {
      id
      evaluationForms {
        id
        title
      }
      evaluationForm {
        id
        title
      }
    }
  `,
);
