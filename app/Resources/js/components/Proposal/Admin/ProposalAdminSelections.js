// @flow
import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field, FieldArray } from 'redux-form';
import {
  ButtonToolbar,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import type { ProposalAdminSelections_proposal } from './__generated__/ProposalAdminSelections_proposal.graphql';
import type { State } from '../../../types';
import component from '../../Form/Field';
import toggle from '../../Form/Toggle';
import ProposalAdminProgessSteps from './ProposalAdminProgessSteps';

export const formName = 'proposal-admin-selections';
type PassedProps = {
  proposal: ProposalAdminSelections_proposal,
};
type Props = {
  proposal: ProposalAdminSelections_proposal,
  handleSubmit: Function,
};
type DefaultProps = void;

const onSubmit = values => {
  console.log(values);
};

export class ProposalAdminSelections extends Component<
  DefaultProps,
  Props,
  void,
> {
  render() {
    console.log('ProposalAdminSelections', this.props);
    const { proposal, handleSubmit } = this.props;
    const steps = proposal.project.steps;
    const collectStep = steps.filter(step => step.kind === 'collect')[0];
    const selectionSteps = steps.filter(step => step.kind === 'selection');
    return (
      <div className="box box-primary">
        <div className="box-header">
          <h4 className="box-title">Etapes</h4>
          <a
            className="pull-right link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://aide.cap-collectif.com/article/86-editer-une-proposition-dune-etape-de-depot#avancement">
            <i className="fa fa-info-circle" /> Aide
          </a>
          <h5 style={{ marginBottom: 0, fontWeight: 'bold' }}>Etapes</h5>
        </div>
        <form onSubmit={handleSubmit}>
          <ListGroup style={{ margin: 10, paddingBottom: 10 }}>
            <ListGroupItem>
              <div>
                <strong>{collectStep.title}</strong> -{' '}
                <span>Etape de dépôt</span>
              </div>
              <br />
              <Field
                label="Publié dans cette étape"
                name={`sdqsdqsd`}
                disabled
                component={toggle}
              />
              <div>
                <Field
                  type="select"
                  label="Statut"
                  name="collectStatus"
                  component={component}>
                  <option value={-1}>Aucun statut</option>
                  {collectStep.statuses &&
                    collectStep.statuses.map(status =>
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>,
                    )}
                </Field>
              </div>
            </ListGroupItem>
            {selectionSteps.map((step, index) =>
              <ListGroupItem>
                <div>
                  <strong>{step.title}</strong> -{' '}
                  <span>Etape de sélection</span>
                </div>
                <br />
                <Field
                  label="Publié dans cette étape"
                  name={`selections[${index}].selected`}
                  component={toggle}
                />
                {
                  <div>
                    L'auteur de la proposition sera notifié du changement de
                    statut
                  </div>
                }
                <Field
                  type="select"
                  label="Statut"
                  name={`selections[${index}].status`}
                  component={component}>
                  <option value={-1}>Aucun statut</option>
                  {step.statuses &&
                    step.statuses.map(status =>
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>,
                    )}
                </Field>
                {step.allowingProgressSteps &&
                  <FieldArray
                    name="progressSteps"
                    component={ProposalAdminProgessSteps}
                  />}
              </ListGroupItem>,
            )}
          </ListGroup>
          <ButtonToolbar>
            <Button type="submit">
              <FormattedMessage id="global.save" />
            </Button>
          </ButtonToolbar>
        </form>
      </div>
    );
  }
}

const form = reduxForm({
  onSubmit,
  // validate,
  form: formName,
})(ProposalAdminSelections);

const mapStateToProps = (state: State, props: PassedProps) => {
  const steps = props.proposal.project.steps;
  const selectionSteps = steps.filter(step => step.kind === 'selection');
  return {
    initialValues: {
      progressSteps: props.proposal.progressSteps,
      collectStatus: props.proposal.status ? props.proposal.status.id : null,
      selections: selectionSteps.map(step => {
        const selectionAsArray = props.proposal.selections.filter(
          selection => selection.step.id === step.id,
        );
        const selection = selectionAsArray.length ? selectionAsArray[0] : null;
        const selected = selection != null;
        return {
          step: step.id,
          selected,
          status: selection ? selection.status : null,
        };
      }),
    },
  };
};

const container = connect(mapStateToProps)(form);

export default createFragmentContainer(
  container,
  graphql`
    fragment ProposalAdminSelections_proposal on Proposal {
      id
      status {
        id
      }
      progressSteps {
        id
        title
        startAt
        endAt
      }
      selections {
        step {
          id
        }
        status {
          id
        }
      }
      project {
        steps {
          id
          title
          kind
          ... on SelectionStep {
            allowingProgressSteps
            statuses {
              id
              name
            }
          }
          ... on CollectStep {
            statuses {
              id
              name
            }
          }
        }
      }
    }
  `,
);
