import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import type { EventListCounter_query } from '~relay/EventListCounter_query.graphql'

export const EventListCounter = ({ query }: { query: EventListCounter_query }) => (
  <FormattedMessage
    id="number-of-events"
    values={{
      num: query && query.events && query.events.totalCount ? query.events.totalCount : 0,
    }}
  />
)
export default createFragmentContainer(EventListCounter, {
  query: graphql`
    fragment EventListCounter_query on Query
    @argumentDefinitions(
      count: { type: "Int!" }
      cursor: { type: "String" }
      theme: { type: "ID" }
      district: { type: "ID" }
      project: { type: "ID" }
      locale: { type: "TranslationLocale" }
      search: { type: "String" }
      userType: { type: "ID" }
      isFuture: { type: "Boolean" }
      author: { type: "ID" }
      isRegistrable: { type: "Boolean" }
      orderBy: { type: "EventOrder" }
    ) {
      events(
        first: $count
        after: $cursor
        theme: $theme
        district: $district
        project: $project
        locale: $locale
        search: $search
        userType: $userType
        isFuture: $isFuture
        author: $author
        isRegistrable: $isRegistrable
        orderBy: $orderBy
      ) @connection(key: "EventListPaginated_events", filters: []) {
        edges {
          node {
            id
          }
        }
        totalCount
      }
      eventsWithoutFilters: events {
        totalCount
      }
    }
  `,
})
