// Legacy : https://github.com/cap-collectif/platform/issues/13829
import React from 'react'
import ReactDOM from 'react-dom'
import { graphql, createFragmentContainer } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import RemoveCommentVoteMutation from '../../mutations/RemoveCommentVoteMutation'
import AddCommentVoteMutation from '../../mutations/AddCommentVoteMutation'
import NewLoginOverlay from '../Utils/NewLoginOverlay'
import UnpublishedTooltip from '../Publishable/UnpublishedTooltip'
import type { CommentVoteButton_comment } from '~relay/CommentVoteButton_comment.graphql'
import Icon, { ICON_NAME } from '~/components/Ui/Icons/Icon'
import colors from '~/utils/colors'
type Props = {
  readonly comment: CommentVoteButton_comment
}
const VoteButton: StyledComponent<any, {}, HTMLButtonElement> = styled.button`
  border: none;
  background: none;
  text-transform: lowercase;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: ${colors.darkGray};

  svg {
    margin: 0;
    margin-right: 8px;
  }

  span {
    margin-left: 3px;
    display: none;
    @media (min-width: 768px) {
      display: unset;
    }
  }
`

class CommentVoteButton extends React.Component<Props> {
  target: null
  deleteVote = () => {
    const { comment } = this.props
    RemoveCommentVoteMutation.commit(
      {
        input: {
          commentId: comment.id,
        },
      },
      {
        votesCount: comment.votes.totalCount,
      },
    )
  }
  vote = () => {
    const { comment } = this.props
    AddCommentVoteMutation.commit(
      {
        input: {
          commentId: comment.id,
        },
      },
      {
        votesCount: comment.votes.totalCount,
      },
    )
  }
  renderFormOrDisabled = () => {
    const { comment } = this.props

    if (comment.author && comment.author.isViewer) {
      return (
        <VoteButton type="button" disabled="disabled">
          <Icon name={ICON_NAME.like} size={15} color={colors.secondaryGray} opacity={0.5} />
          {comment.votes.totalCount} <FormattedMessage id="global.ok" />
        </VoteButton>
      )
    }

    return this.renderVoteButton()
  }
  renderVoteButton = () => {
    const { comment } = this.props

    if (comment.viewerHasVote) {
      return (
        <VoteButton
          type="button"
          ref={ref => {
            this.target = ref
          }}
          onClick={this.deleteVote}
        >
          <UnpublishedTooltip target={() => ReactDOM.findDOMNode(this.target)} publishable={comment.viewerVote} />
          <Icon name={ICON_NAME.like} size={15} color={colors.successColor} />
          {comment.votes.totalCount} <FormattedMessage id="global.ok" />
        </VoteButton>
      )
    }

    return (
      <NewLoginOverlay>
        <VoteButton type="button" onClick={this.vote}>
          <Icon name={ICON_NAME.like} size={15} color={colors.secondaryGray} opacity={0.5} />
          {comment.votes.totalCount} <FormattedMessage id="global.ok" />
        </VoteButton>
      </NewLoginOverlay>
    )
  }

  render() {
    return (
      <span>
        <form className="opinion__votes-button">{this.renderFormOrDisabled()} </form>
      </span>
    )
  }
}

export default createFragmentContainer(CommentVoteButton, {
  comment: graphql`
    fragment CommentVoteButton_comment on Comment
    @argumentDefinitions(isAuthenticated: { type: "Boolean!", defaultValue: true }) {
      id
      author {
        isViewer @include(if: $isAuthenticated)
      }
      votes(first: 0) {
        totalCount
      }
      viewerHasVote @include(if: $isAuthenticated)
      viewerVote @include(if: $isAuthenticated) {
        id
        ...UnpublishedTooltip_publishable
      }
    }
  `,
})
