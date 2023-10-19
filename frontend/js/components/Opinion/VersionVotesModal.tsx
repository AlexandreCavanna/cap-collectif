import * as React from 'react'
import type { RelayPaginationProp } from 'react-relay'
import { createPaginationContainer, graphql } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, Row } from 'react-bootstrap'
import CloseButton from '../Form/CloseButton'
import UserBox from '../User/UserBox'
import type { VersionVotesModal_version } from '~relay/VersionVotesModal_version.graphql'

type Props = {
  version: VersionVotesModal_version
  relay: RelayPaginationProp
}
type State = {
  showModal: boolean
  loading: boolean
}

class VersionVotesModal extends React.Component<Props, State> {
  state = {
    showModal: false,
    loading: false,
  }

  show = () => {
    this.setState({
      showModal: true,
    })
  }

  close = () => {
    this.setState({
      showModal: false,
    })
  }

  render() {
    const { relay, version } = this.props
    const moreVotes = version.moreVotes && version.moreVotes.totalCount > 5 ? version.moreVotes.totalCount - 5 : false

    if (!moreVotes) {
      return null
    }

    const { loading, showModal } = this.state
    return (
      <span>
        <Button
          bsStyle="link"
          id="opinion-votes-show-all"
          onClick={this.show}
          className="opinion__votes__more__link text-center"
        >
          {`+${moreVotes}`}
        </Button>
        <Modal
          animation={false}
          show={showModal}
          onHide={this.close}
          bsSize="large"
          className="opinion__votes__more__modal"
          aria-labelledby="opinion-votes-more-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="opinion-votes-more-title">
              <FormattedMessage id="opinion.votes.modal.title" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {version &&
                version.moreVotes &&
                version.moreVotes.edges &&
                version.moreVotes.edges
                  .filter(Boolean)
                  .map(edge => edge.node)
                  .filter(Boolean)
                  .map(vote => vote.author)
                  .filter(Boolean)
                  .map((author, index) => <UserBox key={index} user={author} className="opinion__votes__userbox" />)}
            </Row>
            {relay.hasMore() && (
              <Button
                disabled={loading}
                onClick={() => {
                  this.setState({
                    loading: true,
                  })
                  relay.loadMore(100, () => {
                    this.setState({
                      loading: false,
                    })
                  })
                }}
              >
                <FormattedMessage id="global.more" />
              </Button>
            )}
          </Modal.Body>
          <Modal.Footer>
            <CloseButton onClose={this.close} label="global.close" />
          </Modal.Footer>
        </Modal>
      </span>
    )
  }
}

export default createPaginationContainer(
  VersionVotesModal,
  {
    version: graphql`
      fragment VersionVotesModal_version on Version
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
        id
        moreVotes: votes(first: $count, after: $cursor) @connection(key: "VersionVotesModal_moreVotes", filters: []) {
          totalCount
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              author {
                id
                ...UserBox_user
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',

    getConnectionFromProps(props: Props) {
      return props.version && props.version.moreVotes
    },

    getFragmentVariables(prevVars) {
      return { ...prevVars }
    },

    getVariables(props: Props, { count, cursor }, fragmentVariables) {
      return { ...fragmentVariables, count, cursor, versionId: props.version.id }
    },

    query: graphql`
      query VersionVotesModalPaginatedQuery($versionId: ID!, $cursor: String, $count: Int) {
        version: node(id: $versionId) {
          ...VersionVotesModal_version @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  },
)
