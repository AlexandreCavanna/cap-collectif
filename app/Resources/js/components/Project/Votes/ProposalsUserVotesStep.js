// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate';
import { submit, isDirty, isSubmitting } from 'redux-form';
import { connect, type MapStateToProps } from 'react-redux';
import { graphql, createFragmentContainer } from 'react-relay';
import ProposalsUserVotesTable from './ProposalsUserVotesTable';
import SubmitButton from '../../Form/SubmitButton';
import UpdateProposalVotesMutation from '../../../mutations/UpdateProposalVotesMutation';
import type { ProposalsUserVotesStep_step } from './__generated__/ProposalsUserVotesStep_step.graphql';

type RelayProps = {
  step: ProposalsUserVotesStep_step,
};
type Props = RelayProps & {
  dispatch: Function,
  dirty: boolean,
  submitting: boolean,
};

export class ProposalsUserVotesStep extends React.Component<Props> {
  onSubmit = (values: { votes: Array<{ anonymous: boolean, id: string }> }) => {
    return UpdateProposalVotesMutation.commit({
      input: {
        step: this.props.step.id,
        votes: values.votes,
      },
    });
  };

  render() {
    const { step, dirty, submitting, dispatch } = this.props;
    if (!step.viewerVotes) {
      return;
    }

    return (
      <div className="block">
        <h2>
          <a
            className="pull-left btn btn-default"
            href={step.show_url}
            style={{ marginRight: '15px' }}>
            <i className="cap cap-arrow-1-1" />
            <span>
              {' '}
              <FormattedMessage id="project.votes.back" />
            </span>
          </a>
          {`${step.title} `}
          {step.voteType === 'BUDGET' ? (
            <FormattedMessage id="project.votes.type.budget" />
          ) : (
            <FormattedMessage id="project.votes.type.simple" />
          )}
        </h2>
        {step.votesHelpText && (
          <div className="well mb-0 mt-10">
            <p>
              <b>
                <FormattedMessage id="admin.fields.step.votesHelpText" />
              </b>
            </p>
            <Truncate lines={3}>{step.votesHelpText}</Truncate>
          </div>
        )}
        <h3 className="d-ib mr-10 mb-10">
          <FormattedMessage id="modal-ranking" />
        </h3>
        <h4 className="excerpt d-ib">
          <FormattedMessage
            id="project.votes.nb"
            values={{
              num: step.viewerVotes.totalCount,
            }}
          />
        </h4>
        {step.viewerVotes.totalCount > 0 && (
          <div>
            <ProposalsUserVotesTable
              onSubmit={this.onSubmit}
              deletable
              step={step}
              votes={step.viewerVotes}
            />
            <SubmitButton
              id="confirm-update-votes"
              disabled={!dirty}
              onSubmit={() => {
                dispatch(submit(`proposal-user-vote-form-step-${step.id}`));
              }}
              label="global.save_modifications"
              isSubmitting={submitting}
              bsStyle="success"
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props: RelayProps) => ({
  dirty: isDirty(`proposal-user-vote-form-step-${props.step.id}`)(state),
  submitting: isSubmitting(`proposal-user-vote-form-step-${props.step.id}`)(state),
});
const container = connect(mapStateToProps)(ProposalsUserVotesStep);

export default createFragmentContainer(container, {
  step: graphql`
    fragment ProposalsUserVotesStep_step on ProposalStep
      @argumentDefinitions(isAuthenticated: { type: "Boolean", defaultValue: true }) {
      ...ProposalsUserVotesTable_step
      id
      title
      voteType
      votesHelpText
      open
      show_url
      viewerVotes(orderBy: { field: POSITION, direction: ASC }) @include(if: $isAuthenticated) {
        totalCount
        ...ProposalsUserVotesTable_votes
      }
    }
  `,
});
