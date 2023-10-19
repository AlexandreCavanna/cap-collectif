import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import CommentAnswer from './CommentAnswer'
import { CommentAnswersContainer } from './styles'
import type { CommentAnswers_comment } from '~relay/CommentAnswers_comment.graphql'
type Props = {
  readonly comment: CommentAnswers_comment
  readonly useBodyColor: boolean
}
type State = {
  readonly highlightedComment: string | null | undefined
}
export class CommentAnswers extends React.Component<Props, State> {
  state = {
    highlightedComment: null,
  }

  componentDidMount() {
    if (window.location.hash.length > 0) {
      this.setState({
        highlightedComment: location.hash.split('_')[1],
      })
    }
  }

  render() {
    const { comment, useBodyColor } = this.props
    const { highlightedComment } = this.state

    if (!comment.answers || comment.answers.totalCount === 0) {
      return null
    }

    return (
      <CommentAnswersContainer id="comments-answers">
        {comment.answers &&
          comment.answers.edges &&
          comment.answers.edges
            .filter(Boolean)
            .map(edge => edge.node)
            .filter(Boolean)
            .map(node => (
              <CommentAnswer
                key={node.id}
                comment={node}
                isHighlighted={node.id === highlightedComment}
                useBodyColor={useBodyColor}
              />
            ))}
      </CommentAnswersContainer>
    )
  }
}
export default createFragmentContainer(CommentAnswers, {
  comment: graphql`
    fragment CommentAnswers_comment on Comment
    @argumentDefinitions(
      count: { type: "Int", defaultValue: 100 }
      cursor: { type: "String" }
      orderBy: { type: "CommentOrder!", defaultValue: { field: PUBLISHED_AT, direction: ASC } }
      isAuthenticated: { type: "Boolean!" }
    ) {
      id
      answers: comments(first: $count, after: $cursor, orderBy: $orderBy)
        @connection(key: "CommentAnswers_answers", filters: []) {
        totalCount
        edges {
          node {
            id
            ...CommentAnswer_comment @arguments(isAuthenticated: $isAuthenticated)
          }
        }
      }
    }
  `,
})
