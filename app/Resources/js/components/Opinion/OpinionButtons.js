import OpinionActions from '../../actions/OpinionActions';
import LoginOverlay from '../Utils/LoginOverlay';
import ShareButtonDropdown from '../Utils/ShareButtonDropdown';
import LoginStore from '../../stores/LoginStore';
import OpinionVersionForm from './OpinionVersionForm';

const ButtonToolbar = ReactBootstrap.ButtonToolbar;
const Button = ReactBootstrap.Button;

const OpinionButtons = React.createClass({
  propTypes: {
    opinion: React.PropTypes.object.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  getInitialState() {
    return {
      hasInitiallyVoted: this.props.opinion.user_vote,
      hasVoted: null,
    };
  },

  renderVoteButton(type) {
    if (type === 'ok') {
      return (
        <Button bsStyle="success" className="btn--outline"
                onClick={this.voteAction.bind(this, 1)}
                active={this.isCurrentVote(1)}
        >
          <i className="cap cap-hand-like-2-1"></i>
          { ' ' + this.getIntlMessage('vote.ok') }
        </Button>
      );
    }
    if (type === 'mitige') {
      return (
        <Button bsStyle="warning" className="btn--outline"
                onClick={this.voteAction.bind(this, 0)}
                active={this.isCurrentVote(0)}
        >
          <i className="cap cap-hand-like-2 icon-rotate"></i>
          { ' ' + this.getIntlMessage('vote.mitige') }
        </Button>
      );
    }
    if (type === 'nok') {
      return (
        <Button bsStyle="danger" className="btn--outline"
                onClick={this.voteAction.bind(this, -1)}
                active={this.isCurrentVote(-1)}
        >
          <i className="cap cap-hand-unlike-2-1"></i>
          { ' ' + this.getIntlMessage('vote.nok') }
        </Button>
      );
    }
  },

  renderEditButton() {
    if (this.isContribuable() && this.isTheUserTheAuthor()) {
      if (this.isVersion()) {
        return (
          <OpinionVersionForm className="pull-right" style={{marginLeft: '5px'}} mode="edit" opinionId={this.props.opinion.parent.id} version={this.props.opinion} />
        );
      }
      return (
        <Button className="opinion__action--edit pull-right btn--outline btn-dark-gray" href={this.props.opinion._links.edit}>
          <i className="cap cap-pencil-1"></i> {this.getIntlMessage('global.edit')}
        </Button>
      );
    }
  },

  renderReportButton() {
    const reported = this.props.opinion.has_user_reported;
    return (
      <Button
        className="opinion__action--report pull-right btn--outline btn-dark-gray" href={reported ? null : this.props.opinion._links.report} active={reported}>
        <i className="cap cap-flag-1"></i>
        { ' ' }
        { reported ? this.getIntlMessage('global.report.reported') : this.getIntlMessage('global.report.submit') }
      </Button>
    );
  },

  render() {
    const opinion = this.props.opinion;
    return (
      <ButtonToolbar style={{marginTop: 15}}>
        {this.isContribuable() ? <LoginOverlay children={ this.renderVoteButton('ok') } /> : null}
        {this.isContribuable() ? <LoginOverlay children={ this.renderVoteButton('mitige') } /> : null}
        {this.isContribuable() ? <LoginOverlay children={ this.renderVoteButton('nok') } /> : null}
        {this.renderEditButton()}
        {this.renderReportButton()}
        <ShareButtonDropdown className="pull-right" title={opinion.title} url={opinion._links.show} />
      </ButtonToolbar>
    );
  },

  isVersion() {
    return this.props.opinion.parent ? true : false;
  },

  isContribuable() {
    return this.isVersion() ? this.props.opinion.parent.isContribuable : this.props.opinion.isContribuable;
  },

 currentVote() {
    return this.state.hasVoted !== null ? this.state.hasVoted : this.state.hasInitiallyVoted;
  },

  isCurrentVote(value) {
    return value === this.currentVote();
  },

  vote(value) {
    this.setState({hasVoted: value});
    if (this.isVersion()) {
      OpinionActions.voteForVersion(this.props.opinion.parent.id, this.props.opinion.id, {value: value});
    } else {
      OpinionActions.vote(this.props.opinion.id, {value: value});
    }
  },

  deleteVote() {
    this.setState({hasVoted: null, hasInitiallyVoted: null});
    if (this.isVersion()) {
      OpinionActions.deleteVoteForVersion(this.props.opinion.parent.id, this.props.opinion.id);
    } else {
      OpinionActions.deleteVote(this.props.opinion.id);
    }
  },

  voteAction(value) {
    if (!LoginStore.isLoggedIn()) {
      return null;
    }
    return this.isCurrentVote(value) ? this.deleteVote() : this.vote(value);
  },

  isTheUserTheAuthor() {
    if (this.props.opinion.author === null || !LoginStore.isLoggedIn()) {
      return false;
    }
    return LoginStore.user.uniqueId === this.props.opinion.author.uniqueId;
  },


});

export default OpinionButtons;
