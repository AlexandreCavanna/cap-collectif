import React, { useState } from 'react'
// TODO https://github.com/cap-collectif/platform/issues/7774
// eslint-disable-next-line no-restricted-imports
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import type { RelayPaginationProp } from 'react-relay'
import { createPaginationContainer, graphql } from 'react-relay'
import type { ArgumentListProfile_argumentList } from '~relay/ArgumentListProfile_argumentList.graphql'
import ArgumentItem from './ArgumentItem'
import Loader from '../Ui/FeedbacksIndicators/Loader'

const ARGUMENTS_PAGINATION = 5
type Props = {
  relay: RelayPaginationProp
  argumentList: ArgumentListProfile_argumentList
}
export const ArgumentListProfile = ({ argumentList, relay }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleLoadMore = () => {
    setLoading(true)
    relay.loadMore(ARGUMENTS_PAGINATION, () => {
      setLoading(false)
    })
  }

  return (
    <ListGroup bsClass="media-list">
      {argumentList.arguments &&
        argumentList.arguments.edges &&
        argumentList.arguments.edges
          .filter(Boolean)
          .map(edge => edge.node)
          .filter(Boolean)
          .map(argument => <ArgumentItem key={argument.id} argument={argument} isProfile />)}
      {relay.hasMore() && (
        <ListGroupItem>
          {loading ? (
            <Loader size={28} inline />
          ) : (
            <Button block bsStyle="link" onClick={handleLoadMore}>
              <FormattedMessage id="global.more" />
            </Button>
          )}
        </ListGroupItem>
      )}
    </ListGroup>
  )
}
export default createPaginationContainer(
  ArgumentListProfile,
  {
    argumentList: graphql`
      fragment ArgumentListProfile_argumentList on User
      @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int!" }, isAuthenticated: { type: "Boolean!" }) {
        id
        arguments(first: $count, after: $cursor) @connection(key: "ArgumentListProfile_arguments") {
          totalCount
          edges {
            node {
              id
              ...ArgumentItem_argument @arguments(isAuthenticated: $isAuthenticated)
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
      return props.argumentList && props.argumentList.arguments
    },

    getFragmentVariables(prevVars) {
      return { ...prevVars }
    },

    getVariables(props: Props, { count, cursor }, fragmentVariables) {
      return { ...fragmentVariables, count, cursor, userId: props.argumentList.id }
    },

    query: graphql`
      query ArgumentListProfileQuery($userId: ID!, $cursor: String, $count: Int!, $isAuthenticated: Boolean!) {
        argumentList: node(id: $userId) {
          id
          ...ArgumentListProfile_argumentList
            @arguments(cursor: $cursor, count: $count, isAuthenticated: $isAuthenticated)
        }
      }
    `,
  },
)
