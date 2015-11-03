import UserAvatar from '../../User/UserAvatar';
import UserLink from '../../User/UserLink';

const FormattedDate = ReactIntl.FormattedDate;

const ProposalPreviewHeader = React.createClass({
  propTypes: {
    proposal: React.PropTypes.object.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  render() {
    const proposal = this.props.proposal;
    const classes = classNames({});

    return (
      <div className={classes}>
        <UserAvatar user={proposal.author} style={{marginRight: 10}} className="pull-left" />
        <div className="proposal__author">
          <UserLink user={proposal.author} />
          <p className="excerpt small">
            <FormattedDate
              value={moment(proposal.created_at)}
              day="numeric" month="long" year="numeric"
              />
          </p>
        </div>
      </div>
    );
  },

});

export default ProposalPreviewHeader;
