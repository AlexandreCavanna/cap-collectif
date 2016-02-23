import React from 'react';
import moment from 'moment';
import UserAvatar from '../../User/UserAvatar';
import UserLink from '../../User/UserLink';
import { IntlMixin, FormattedMessage, FormattedDate } from 'react-intl';

const ProposalPreviewHeader = React.createClass({
  propTypes: {
    proposal: React.PropTypes.object.isRequired,
  },
  mixins: [IntlMixin],

  render() {
    const proposal = this.props.proposal;
    const updatedDate = (
      <FormattedDate
        value={moment(proposal.updated_at)}
        day="numeric" month="long" year="numeric"
      />
    );

    return (
      <div>
        <UserAvatar user={proposal.author} className="pull-left proposal__avatar" />
        <div className="proposal__author">
          <UserLink user={proposal.author} />
          <p className="excerpt small proposal__date" >
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
