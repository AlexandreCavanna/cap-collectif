import * as React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createFragmentContainer, graphql } from 'react-relay'
import CommentSectionFragmented from '../../Comment/CommentSectionFragmented'
import type { ProposalPageComments_proposal } from '~relay/ProposalPageComments_proposal.graphql'
import type { GlobalState } from '../../../types'

type Props = {
  proposal: ProposalPageComments_proposal
  className: string
  isAuthenticated: boolean
}

class ProposalPageComments extends React.Component<Props> {
  static defaultProps = {
    className: '',
  }

  render() {
    const { className, proposal, isAuthenticated } = this.props
    if (!proposal) return null
    const classes = {
      [className]: true,
    }
    return (
      <div className={classNames(classes)}>
        {proposal.form.commentable && (
          <CommentSectionFragmented isAuthenticated={isAuthenticated} commentable={proposal} useBodyColor />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  isAuthenticated: !!state.user.user,
})

// @ts-ignore
const container = connect(mapStateToProps)(ProposalPageComments)
export default createFragmentContainer(container, {
  proposal: graphql`
    fragment ProposalPageComments_proposal on Proposal {
      id
      form {
        id
        commentable
      }
      ...CommentSectionFragmented_commentable @arguments(isAuthenticated: $isAuthenticated)
    }
  `,
})
