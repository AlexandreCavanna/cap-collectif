import React, { useState } from 'react'
import type { RelayPaginationProp } from 'react-relay'
import { graphql, createPaginationContainer } from 'react-relay'
import { ListGroupItem, Button, Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import OpinionVersion from './OpinionVersion'
import Loader from '../Ui/FeedbacksIndicators/Loader'
import type { OpinionVersionListViewPaginated_opinion } from '~relay/OpinionVersionListViewPaginated_opinion.graphql'
import ListGroup from '../Ui/List/ListGroup'

type Props = {
  isProfile: boolean
  relay: RelayPaginationProp
  opinion: OpinionVersionListViewPaginated_opinion
}

const OpinionVersionListViewPaginated = ({ opinion, relay, isProfile }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { edges } = opinion.versions

  if (!edges || edges.length === 0) {
    return (
      <Panel.Body className="text-center excerpt">
        <i className="cap-32 cap-baloon-1" />
        <br />
        <FormattedMessage id="opinion.no_new_version" />
      </Panel.Body>
    )
  }

  return (
    <ListGroup id="versions-list">
      {edges
        .filter(Boolean)
        .map(edge => edge.node)
        .filter(Boolean)
        .map(version => (
          <OpinionVersion key={version.id} version={version} isProfile={isProfile} />
        ))}
      {relay.hasMore() && (
        <ListGroupItem>
          {loading ? (
            <Loader size={28} inline />
          ) : (
            <Button
              block
              bsStyle="link"
              onClick={() => {
                setLoading(true)
                relay.loadMore(50, () => {
                  setLoading(false)
                })
              }}
            >
              <FormattedMessage id="see-more-amendments" />
            </Button>
          )}
        </ListGroupItem>
      )}
    </ListGroup>
  )
}

OpinionVersionListViewPaginated.defaultProps = {
  isProfile: false,
}
export default createPaginationContainer(
  OpinionVersionListViewPaginated,
  {
    opinion: graphql`
      fragment OpinionVersionListViewPaginated_opinion on Opinion
      @argumentDefinitions(
        isAuthenticated: { type: "Boolean", defaultValue: true }
        count: { type: "Int!" }
        cursor: { type: "String" }
        orderBy: { type: "VersionOrder!" }
      ) {
        id
        versions(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "OpinionVersionListViewPaginated_versions", filters: ["orderBy"]) {
          totalCount
          edges {
            node {
              id
              ...OpinionVersion_version
            }
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',

    getConnectionFromProps(props: Props) {
      return props.opinion && props.opinion.versions
    },

    getFragmentVariables(prevVars) {
      return { ...prevVars }
    },

    getVariables(props: Props, { count, cursor }, fragmentVariables) {
      return { ...fragmentVariables, count, cursor, opinionId: props.opinion.id }
    },

    query: graphql`
      query OpinionVersionListViewPaginatedPaginatedQuery(
        $opinionId: ID!
        $isAuthenticated: Boolean!
        $cursor: String
        $orderBy: VersionOrder!
        $count: Int!
      ) {
        opinion: node(id: $opinionId) {
          id
          ...OpinionVersionListViewPaginated_opinion
            @arguments(isAuthenticated: $isAuthenticated, cursor: $cursor, orderBy: $orderBy, count: $count)
        }
      }
    `,
  },
)
