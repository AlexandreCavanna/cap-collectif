import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import { Button, Collapse, ListGroupItem } from 'react-bootstrap'
import UnfollowOpinionMutation from '../../../mutations/UnfollowOpinionMutation'
import type { OpinionRow_opinion } from '~relay/OpinionRow_opinion.graphql'
import '~relay/OpinionRow_opinion.graphql'

type Props = {
  opinion: OpinionRow_opinion
}
type State = {
  open: boolean
}
export class OpinionRow extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      open: true,
    }
  }

  onUnfollowCurrentOpinion(opinionId: string) {
    const { open } = this.state
    this.setState(
      {
        open: !open,
      },
      () => {
        UnfollowOpinionMutation.commit({
          input: {
            opinionId,
          },
        })
      },
    )
  }

  render() {
    const { opinion } = this.props
    const { open } = this.state
    return (
      <Collapse in={open} id={`collapse-proposal-${opinion.id}`}>
        <ListGroupItem id={`item-opinion-${opinion.id}`}>
          <h4>
            <a
              href={opinion.url}
              title={opinion.title}
              id={`item-opinion-link-${opinion.id}`}
              className="profile__opinion__open__link"
            >
              {opinion.title}
            </a>
          </h4>
          <Button
            id={`profile-opinion-unfollow-button-${opinion.id}`}
            onClick={() => {
              this.onUnfollowCurrentOpinion(opinion.id)
            }}
          >
            <FormattedMessage id="unfollow" />
          </Button>
        </ListGroupItem>
      </Collapse>
    )
  }
}
export default createFragmentContainer(OpinionRow, {
  opinion: graphql`
    fragment OpinionRow_opinion on Opinion {
      id
      title
      url
    }
  `,
})
