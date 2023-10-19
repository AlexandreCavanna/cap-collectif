import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import ArgumentVoteButton from './ArgumentVoteButton'
import type { ArgumentVoteBox_argument } from '~relay/ArgumentVoteBox_argument.graphql'

type Props = {
  argument: ArgumentVoteBox_argument
}
export class ArgumentVoteBox extends React.Component<Props> {
  render() {
    const { argument } = this.props
    return (
      <>
        <form className="opinion__votes-button">
          <ArgumentVoteButton argument={argument} />
        </form>
        <span className="opinion__votes-nb">{argument.votes.totalCount}</span>
      </>
    )
  }
}
export default createFragmentContainer(ArgumentVoteBox, {
  argument: graphql`
    fragment ArgumentVoteBox_argument on Argument
    @argumentDefinitions(isAuthenticated: { type: "Boolean!", defaultValue: true }) {
      votes(first: 0) {
        totalCount
      }
      ...ArgumentVoteButton_argument @arguments(isAuthenticated: $isAuthenticated)
    }
  `,
})
