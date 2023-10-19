import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Row, Col } from 'react-bootstrap'
import { formValueSelector } from 'redux-form'
import type { RelayPaginationProp } from 'react-relay'
import { graphql, createPaginationContainer } from 'react-relay'
import classNames from 'classnames'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { useWindowWidth } from '~/utils/hooks/useWindowWidth'
import EventPreview from '../EventPreview/EventPreview'
import EventMap from '../Map/EventMap'
import EventPagePassedEventsPreview from './EventPagePassedEventsPreview'
import type { EventListPaginated_query } from '~relay/EventListPaginated_query.graphql'
import type { GlobalState, Dispatch, FeatureToggles } from '~/types'
import { changeEventSelected } from '~/redux/modules/event'
import { bootstrapGrid } from '~/utils/sizes'
type OwnProps = {
  readonly query: EventListPaginated_query
  readonly relay: RelayPaginationProp
  readonly formName: string
}
type Props = OwnProps & {
  readonly eventSelected: string | null | undefined
  readonly dispatch: Dispatch
  readonly features: FeatureToggles
  readonly isMobileListView: boolean
  readonly status: string
}
const EVENTS_PAGINATION = 50
const MapContainer: StyledComponent<any, {}, typeof Col> = styled(Col)`
  top: 150px;
  position: sticky;

  @media screen and (max-width: 991px) {
    top: 0;
  }
`
const EventListContainer: StyledComponent<any, {}, typeof Col> = styled(Col)`
  .eventPreview {
    margin-bottom: 15px;
  }
`
export const EventListPaginated = (props: Props) => {
  const { status, query, relay, features, dispatch, eventSelected, isMobileListView, formName } = props
  const [loading, setLoading] = useState(false)
  const { width } = useWindowWidth()

  const onFocus = (eventId: string) => {
    if (features.display_map) {
      dispatch(changeEventSelected(eventId))
    }
  }

  const shouldRenderToggleListOrMap = (component: 'list' | 'map'): boolean => {
    if (component === 'list') {
      if (width > bootstrapGrid.smMax) {
        return true
      }

      return isMobileListView
    }

    if (component === 'map' && features.display_map) {
      if (width > bootstrapGrid.smMax) {
        return true
      }

      return !isMobileListView
    }

    return false
  }

  if (!query.events || query.events.totalCount === 0) {
    const showPreviewPassedEvents =
      status === 'ongoing-and-future' && query.previewPassedEvents && query.previewPassedEvents.totalCount > 0
    return (
      <>
        <p
          className={classNames({
            'p--centered': true,
            'mb-40': true,
          })}
        >
          <FormattedMessage id={showPreviewPassedEvents ? 'no-upcoming-events' : 'event.empty'} />
        </p>
        {showPreviewPassedEvents ? <EventPagePassedEventsPreview query={query} formName={formName} /> : null}
      </>
    )
  }

  return (
    <Row>
      {shouldRenderToggleListOrMap('list') ? (
        <EventListContainer id="event-list" md={features.display_map ? 8 : 12} xs={12}>
          {query.events.edges &&
            query.events.edges
              .filter(Boolean)
              .map(edge => edge.node)
              .filter(Boolean)
              .map((node, key) => {
                const highlighted = eventSelected && eventSelected === node.id
                return (
                  // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                  <div key={key} onMouseOver={() => (width > bootstrapGrid.smMax ? onFocus(node.id) : null)}>
                    <EventPreview isHighlighted={Boolean(highlighted)} event={node} />
                  </div>
                )
              })}
          {relay.hasMore() && (
            <Row>
              <div className="text-center">
                <Button
                  disabled={loading}
                  onClick={() => {
                    setLoading(true)
                    relay.loadMore(EVENTS_PAGINATION, () => {
                      setLoading(false)
                    })
                  }}
                >
                  <FormattedMessage id={loading ? 'global.loading' : 'see-more-events'} />
                </Button>
              </div>
            </Row>
          )}
        </EventListContainer>
      ) : null}
      {shouldRenderToggleListOrMap('map') ? (
        <MapContainer md={4} xs={12} aria-hidden="true">
          <EventMap query={query} />
        </MapContainer>
      ) : null}
    </Row>
  )
}
const selector = formValueSelector('EventPageContainer')

const mapStateToProps = (state: GlobalState) => ({
  eventSelected: state.event.eventSelected,
  features: state.default.features,
  isMobileListView: state.event.isMobileListView,
  status: selector(state, 'status'),
})

const container = connect<Props, OwnProps, _, _, _, _>(mapStateToProps)(EventListPaginated)
export default createPaginationContainer(
  container,
  {
    query: graphql`
      fragment EventListPaginated_query on Query
      @argumentDefinitions(
        count: { type: "Int!" }
        cursor: { type: "String" }
        theme: { type: "ID" }
        project: { type: "ID" }
        locale: { type: "TranslationLocale" }
        search: { type: "String" }
        userType: { type: "ID" }
        isFuture: { type: "Boolean" }
        previewCount: { type: "Int", defaultValue: 5 }
        author: { type: "ID" }
        isRegistrable: { type: "Boolean" }
        orderBy: { type: "EventOrder" }
        isAuthenticated: { type: "Boolean!" }
      ) {
        previewPassedEvents: events(locale: $locale, first: $previewCount, isFuture: false, orderBy: $orderBy) {
          totalCount
        }
        ...EventPagePassedEventsPreview_query
          @arguments(locale: $locale, previewCount: $previewCount, orderBy: $orderBy, isAuthenticated: $isAuthenticated)
        ...EventMap_query
          @arguments(
            count: $count
            cursor: $cursor
            theme: $theme
            project: $project
            locale: $locale
            search: $search
            userType: $userType
            isFuture: $isFuture
            author: $author
            isRegistrable: $isRegistrable
            orderBy: $orderBy
          )
        events(
          first: $count
          after: $cursor
          theme: $theme
          project: $project
          locale: $locale
          search: $search
          userType: $userType
          isFuture: $isFuture
          author: $author
          isRegistrable: $isRegistrable
          orderBy: $orderBy
        ) @connection(key: "EventListPaginated_events", filters: []) {
          totalCount
          edges {
            node {
              id
              ...EventPreview_event @arguments(isAuthenticated: $isAuthenticated)
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
      return props.query && props.query.events
    },

    getFragmentVariables(prevVars: Record<string, any>) {
      return { ...prevVars }
    },

    getVariables(props: Props, { count, cursor }: Record<string, any>, fragmentVariables: any) {
      return { ...fragmentVariables, count, cursor }
    },

    query: graphql`
      query EventListPaginatedQuery(
        $cursor: String
        $count: Int!
        $theme: ID
        $project: ID
        $locale: TranslationLocale
        $search: String
        $userType: ID
        $isFuture: Boolean
        $author: ID
        $isRegistrable: Boolean
        $orderBy: EventOrder
        $isAuthenticated: Boolean!
      ) {
        ...EventListPaginated_query
          @arguments(
            cursor: $cursor
            count: $count
            theme: $theme
            project: $project
            locale: $locale
            search: $search
            userType: $userType
            isFuture: $isFuture
            author: $author
            isRegistrable: $isRegistrable
            orderBy: $orderBy
            isAuthenticated: $isAuthenticated
          )
      }
    `,
  },
)
