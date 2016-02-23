import React from 'react';
import { IntlMixin } from 'react-intl';
import LoginStore from '../../../stores/LoginStore';
import UserPreview from '../../User/UserPreview';
import SubmitButton from '../../Form/SubmitButton';
import ProposalVoteForm from './ProposalVoteForm';
import LoginButton from '../../Utils/LoginButton';
import { VOTE_TYPE_BUDGET, VOTE_TYPE_SIMPLE } from '../../../constants/ProposalConstants';

const ProposalVoteBox = React.createClass({
  propTypes: {
    proposal: React.PropTypes.object.isRequired,
    votableStep: React.PropTypes.object.isRequired,
    userHasVote: React.PropTypes.bool,
    creditsLeft: React.PropTypes.number,
    className: React.PropTypes.string,
    formWrapperClassName: React.PropTypes.string,
    onSubmit: React.PropTypes.func,
    onSubmitSuccess: React.PropTypes.func,
    onSubmitFailure: React.PropTypes.func,
    onValidationFailure: React.PropTypes.func,
  },
  mixins: [IntlMixin],

  getDefaultProps() {
    return {
      userHasVote: false,
      creditsLeft: null,
      className: '',
      formWrapperClassName: '',
      onSubmit: () => {},
      onSubmitSuccess: () => {},
      onSubmitFailure: () => {},
      onValidationFailure: () => {},
    };
  },

  getInitialState() {
    return {
      isSubmitting: false,
    };
  },

  handleSubmit() {
    this.setState({
      isSubmitting: true,
    });
    this.props.onSubmit();
  },

  handleSubmitSuccess() {
    this.setState({
      isSubmitting: false,
    });
    this.props.onSubmitSuccess();
  },

  handleSubmitFailure() {
    this.setState({
      isSubmitting: false,
    });
    this.props.onSubmitFailure();
  },

  handleValidationFailure() {
    this.setState({
      isSubmitting: false,
    });
    this.props.onValidationFailure();
  },

  userHasVote() {
    return LoginStore.isLoggedIn() && this.props.userHasVote;
  },

  userHasEnoughCredits() {
    if (LoginStore.isLoggedIn() && !this.userHasVote() && this.props.creditsLeft !== null && this.props.proposal.estimation !== null) {
      return this.props.creditsLeft >= this.props.proposal.estimation;
    }
    return true;
  },

  displayForm() {
    return this.props.votableStep.isOpen && (this.props.voteType === VOTE_TYPE_SIMPLE || (LoginStore.isLoggedIn() && this.userHasEnoughCredits()));
  },

  disableSubmitButton() {
    return !this.props.votableStep.isOpen || (LoginStore.isLoggedIn() && this.props.voteType === VOTE_TYPE_BUDGET && !this.userHasEnoughCredits());
  },

  render() {
    return (
      <div className={this.props.className}>
        {
          LoginStore.isLoggedIn()
            ? <UserPreview
                user={LoginStore.user}
                style={{ padding: '0', marginBottom: '0', fontSize: '18px' }}
            />
            : null
        }
        <div className={this.props.formWrapperClassName}>
          {
            this.displayForm()
              ? <ProposalVoteForm
              proposal={this.props.proposal}
              selectionStepId={this.props.votableStep.id}
              isSubmitting={this.state.isSubmitting}
              onValidationFailure={this.handleValidationFailure}
              onSubmitSuccess={this.handleSubmitSuccess}
              onSubmitFailure={this.handleSubmitFailure}
              userHasVote={this.props.userHasVote}
            />
            : null
          }
          {
            !this.userHasEnoughCredits() && !this.state.isSubmitting
            ? <p style={{ marginTop: '10px' }}>
                {this.getIntlMessage('proposal.vote.not_enough_credits')}
              </p>
            : null
          }
          {
            this.props.votableStep.openingStatus === 'future'
              ? <p style={{ marginTop: '10px' }}>
              {this.getIntlMessage('proposal.vote.step_not_yet_open')}
            </p>
              : null
          }
          {
            this.props.votableStep.openingStatus === 'closed'
              ? <p style={{ marginTop: '10px' }}>
              {this.getIntlMessage('proposal.vote.step_closed')}
            </p>
              : null
          }
        </div>
        <SubmitButton
          id="confirm-proposal-vote"
          isSubmitting={this.state.isSubmitting}
          onSubmit={this.handleSubmit}
          label={this.props.userHasVote ? 'proposal.vote.delete' : 'proposal.vote.add'}
          bsStyle={(!this.props.userHasVote || this.state.isSubmitting) ? 'success' : 'danger'}
          className="btn-block"
          style={{ marginTop: '10px' }}
          disabled={this.disableSubmitButton()}
          loginOverlay={this.props.voteType === VOTE_TYPE_BUDGET}
        />
        {
          !LoginStore.isLoggedIn() && this.props.voteType !== VOTE_TYPE_BUDGET
          ? <div>
            <p
              className="text-center excerpt"
              style={{ margin: '10px 0 0' }}
            >
              {this.getIntlMessage('global.or')}
            </p>
            <LoginButton
              label="proposal.vote.vote_with_my_account"
              className="btn-block"
            />
          </div>
          : null
        }
      </div>
    );
  },

});

export default ProposalVoteBox;
