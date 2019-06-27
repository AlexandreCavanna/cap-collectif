// @flow
import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import UserAvatar from '../../User/UserAvatar';
import type { OpinionUserVote_vote } from '~relay/OpinionUserVote_vote.graphql';

type Props = {
  vote: OpinionUserVote_vote,
  className?: string,
};

class OpinionUserVote extends React.Component<Props> {
  render() {
    const { vote, className } = this.props;
    if (!vote.author) return null;
    return (
      <span className={className}>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`opinion-vote-tooltip-${vote.id}`}>{vote.author.displayName}</Tooltip>
          }>
          {/* $FlowFixMe Will be a fragment soon */}
          <UserAvatar user={vote.author} className="" />
        </OverlayTrigger>
      </span>
    );
  }
}

export default createFragmentContainer(OpinionUserVote, {
  vote: graphql`
    fragment OpinionUserVote_vote on YesNoPairedVote {
      id
      author {
        displayName
        media {
          url
        }
      }
    }
  `,
});
