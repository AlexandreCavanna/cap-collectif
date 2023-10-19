import * as React from 'react'
import type { RelayRefetchProp } from 'react-relay'
import { graphql, createRefetchContainer } from 'react-relay'
import Loader from '../../Ui/FeedbacksIndicators/Loader'
import OpinionSourceListViewPaginated from './OpinionSourceListViewPaginated'
import type { OpinionSourceListView_sourceable } from '~relay/OpinionSourceListView_sourceable.graphql'
import type { OpinionSourceListViewRefetchQueryVariables } from '~relay/OpinionSourceListViewRefetchQuery.graphql'
export type OpinionSourceOrder = 'old' | 'last' | 'popular'
type Props = {
  order: OpinionSourceOrder
  relay: RelayRefetchProp
  sourceable: OpinionSourceListView_sourceable
}
type State = {
  isRefetching: boolean
}
export class OpinionSourceListView extends React.Component<Props, State> {
  state = {
    isRefetching: false,
  }

  componentDidUpdate(prevProps: Props) {
    const { order } = this.props

    if (prevProps.order !== order) {
      this._refetch(order)
    }
  }

  _refetch = (newOrder: OpinionSourceOrder) => {
    const { sourceable, relay } = this.props
    this.setState({
      isRefetching: true,
    })
    const direction = newOrder === 'old' ? 'ASC' : 'DESC'
    const field = newOrder === 'popular' ? 'VOTES' : 'PUBLISHED_AT'
    const orderBy = {
      direction,
      field,
    }

    const refetchVariables = fragmentVariables =>
      ({
        sourceableId: sourceable.id,
        count: fragmentVariables.count,
        isAuthenticated: fragmentVariables.isAuthenticated,
        cursor: null,
        orderBy,
      } as OpinionSourceListViewRefetchQueryVariables)

    relay.refetch(
      refetchVariables,
      null,
      () => {
        this.setState({
          isRefetching: false,
        })
      },
      {
        force: true,
      },
    )
  }

  render() {
    const { sourceable } = this.props
    const { isRefetching } = this.state

    if (isRefetching) {
      return <Loader />
    }

    return <OpinionSourceListViewPaginated sourceable={sourceable} />
  }
}
export default createRefetchContainer(
  OpinionSourceListView,
  {
    sourceable: graphql`
      fragment OpinionSourceListView_sourceable on Sourceable
      @argumentDefinitions(
        isAuthenticated: { type: "Boolean!" }
        count: { type: "Int!" }
        cursor: { type: "String" }
        orderBy: { type: "SourceOrder!" }
      ) {
        id
        ...OpinionSourceListViewPaginated_sourceable
          @arguments(isAuthenticated: $isAuthenticated, cursor: $cursor, count: $count, orderBy: $orderBy)
      }
    `,
  },
  graphql`
    query OpinionSourceListViewRefetchQuery(
      $isAuthenticated: Boolean!
      $sourceableId: ID!
      $cursor: String
      $orderBy: SourceOrder!
      $count: Int!
    ) {
      sourceable: node(id: $sourceableId) {
        id
        ...OpinionSourceListView_sourceable
          @arguments(isAuthenticated: $isAuthenticated, cursor: $cursor, count: $count, orderBy: $orderBy)
      }
    }
  `,
)
