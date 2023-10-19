import React from 'react'
import { connect } from 'react-redux'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { QueryRenderer, graphql } from 'react-relay'
import { FormattedMessage } from 'react-intl'
import environment, { graphqlError } from '../../createRelayEnvironment'
import EventPreview from '../Event/EventPreview/EventPreview'
import { mediaQueryMobile } from '~/utils/sizes'
import type { HomePageEventsQueryResponse, HomePageEventsQueryVariables } from '~relay/HomePageEventsQuery.graphql'
import type { State } from '~/types'
export type Props = {
  readonly showAllUrl: string
  readonly section: {
    readonly title: string | null | undefined
    readonly teaser: string | null | undefined
    readonly body: string | null | undefined
    readonly nbObjects: number | null | undefined
  }
  readonly isAuthenticated: boolean
}
export const EventContainer: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  padding-top: 20px;
  width: 100%;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
  grid-auto-columns: 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .eventPreview {
      width: 49%;
      margin-bottom: 20px;
    }
  }

  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    display: flex;
    flex-direction: column;

    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      .eventPreview {
        width: 100%;
      }
    }

    .eventPreview {
      margin: 0 0 20px 0;

      .eventImage {
        border-radius: 0;
      }
    }
  }
`
const DEFAULT_EVENTS = 4

class HomePageEvents extends React.Component<Props> {
  renderEventList = ({
    error,
    props,
  }: ReactRelayReadyState & {
    props: HomePageEventsQueryResponse | null | undefined
  }) => {
    if (error) {
      return graphqlError
    }

    if (props && props.events.edges && props.events.edges.length > 0) {
      const { section, showAllUrl } = this.props
      return (
        <div className="container">
          <h2 className="h2">{section.title ? section.title : <FormattedMessage id="homepage.section.events" />}</h2>
          {section.teaser ? <p className="block">{section.teaser}</p> : null}
          {section.body ? <p>{section.body}</p> : null}

          <EventContainer>
            {props.events.edges &&
              props.events.edges
                .filter(Boolean)
                .map(edge => edge.node)
                .filter(Boolean)
                .map(node => <EventPreview event={node} key={node.id} />)}
          </EventContainer>
          <a href={showAllUrl} className="btn btn-primary btn--outline">
            <FormattedMessage id="event.see_all" />
          </a>
        </div>
      )
    }

    return null
  }

  render() {
    const { section, isAuthenticated } = this.props
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query HomePageEventsQuery(
            $count: Int
            $orderBy: EventOrder!
            $isFuture: Boolean!
            $isAuthenticated: Boolean!
          ) {
            events(orderBy: $orderBy, first: $count, isFuture: $isFuture) {
              edges {
                node {
                  id
                  ...EventPreview_event @arguments(isAuthenticated: $isAuthenticated)
                }
              }
            }
          }
        `}
        variables={
          {
            count: section.nbObjects ? section.nbObjects : DEFAULT_EVENTS,
            isFuture: true,
            orderBy: {
              field: 'START_AT',
              direction: 'ASC',
            },
            isAuthenticated,
          } as HomePageEventsQueryVariables
        }
        render={this.renderEventList}
      />
    )
  }
}

const mapStateToProps = (state: State) => ({
  isAuthenticated: state.user.user !== null,
})

export default connect<any, any>(mapStateToProps)(HomePageEvents)
