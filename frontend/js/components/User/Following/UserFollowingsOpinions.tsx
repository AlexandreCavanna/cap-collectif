import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Collapse } from 'react-bootstrap'
import { graphql, createFragmentContainer } from 'react-relay'
import type { UserFollowingsOpinions_viewer } from '~relay/UserFollowingsOpinions_viewer.graphql'
import '~relay/UserFollowingsOpinions_viewer.graphql'
import UnfollowOpinionMutation from '../../../mutations/UnfollowOpinionMutation'
import OpinionProjectRow from './OpinionProjectRow'

type Props = {
  viewer: UserFollowingsOpinions_viewer
}
type State = {
  open: boolean
}
export class UserFollowingsOpinions extends Component<Props, State> {
  state = {
    open: true,
  }

  onUnfollowAll() {
    const { viewer } = this.props
    const { open } = this.state
    const idsOpinion = viewer.followingOpinions.edges
      ? viewer.followingOpinions.edges.filter(Boolean).map(edge => edge.node.id)
      : []
    this.setState(
      {
        open: !open,
      },
      () => {
        UnfollowOpinionMutation.commit({
          input: {
            idsOpinion,
          },
        })
      },
    )
  }

  render() {
    const { viewer } = this.props
    const { open } = this.state
    const projectsById = {}

    if (viewer.followingOpinions.edges) {
      viewer.followingOpinions.edges.map(edge => {
        if (edge?.node?.project) {
          projectsById[edge.node.project.id] = edge.node.project
        }
      })
    }

    return (
      <div>
        <h2 className="page-header">
          <FormattedMessage id="followings" />
          {Object.keys(projectsById).length > 0 ? (
            <Collapse
              style={{
                float: 'right',
              }}
              in={open}
            >
              <Button
                id="unfollow-all"
                onClick={() => {
                  this.onUnfollowAll()
                }}
              >
                <FormattedMessage id="unfollow-all" />
              </Button>
            </Collapse>
          ) : (
            ''
          )}
        </h2>
        <div>
          {Object.keys(projectsById).length > 0 ? (
            <Collapse in={open}>
              <div id="all-projects">
                {Object.keys(projectsById).map((project, id) => (
                  <OpinionProjectRow
                    key={id}
                    project={projectsById[project]}
                    // @ts-expect-error
                    viewer={viewer}
                  />
                ))}
              </div>
            </Collapse>
          ) : (
            <div>
              <FormattedMessage id="no-following" />
            </div>
          )}
        </div>
        <div>
          <Collapse in={open}>
            <div>
              <FormattedMessage id="no-following" />
            </div>
          </Collapse>
        </div>
      </div>
    )
  }
}
export default createFragmentContainer(UserFollowingsOpinions, {
  viewer: graphql`
    fragment UserFollowingsOpinions_viewer on User
    @argumentDefinitions(count: { type: "Int", defaultValue: 1000 }, cursor: { type: "String" }) {
      followingOpinions(first: $count, after: $cursor) {
        totalCount
        edges {
          node {
            id
            title
            url
            project {
              id
              title
              url
            }
          }
        }
      }
    }
  `,
})
