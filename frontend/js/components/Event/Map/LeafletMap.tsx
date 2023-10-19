import React from 'react'
import { MapContainer, Marker, Popup } from 'react-leaflet'
import { connect, useSelector, useDispatch } from 'react-redux'
import { graphql } from 'relay-runtime'
import { FormattedMessage } from 'react-intl'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import L from 'leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import { createFragmentContainer } from 'react-relay'
import LocateControl from '~/components/Proposal/Map/LocateControl'
import type { GlobalState, Dispatch } from '~/types'
import { changeEventSelected } from '~/redux/modules/event'
import type { MapOptions } from '~/components/Proposal/Map/Map.types'
import EventMapPreview from './EventMapPreview/EventMapPreview'
import { MAX_MAP_ZOOM } from '~/utils/styles/variables'
import type { LeafletMap_query } from '~relay/LeafletMap_query.graphql'
import { isSafari } from '~/config'
import CapcoTileLayer from '~/components/Utils/CapcoTileLayer'

type Props = {
  query: LeafletMap_query
  defaultMapOptions: MapOptions
  loading: boolean
}

const formatBounds = bounds => {
  if (
    bounds.getNorthEast().lat === bounds.getSouthWest().lat &&
    bounds.getNorthEast().lng === bounds.getSouthWest().lng
  )
    return L.latLngBounds([
      bounds.getCenter(),
      {
        lat: bounds._northEast.lat + 0.001,
        lng: bounds._northEast.lng + 0.001,
      },
      {
        lat: bounds._northEast.lat - 0.001,
        lng: bounds._northEast.lng - 0.001,
      },
    ])
  return bounds
}

export const LeafletMap = ({ loading, query, defaultMapOptions }: Props) => {
  const markers = query.events
  const eventSelected: string | null | undefined = useSelector((state: GlobalState) => state.event.eventSelected)
  const dispatch: Dispatch = useDispatch()
  React.useEffect(() => {
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
  }, [])

  const getMarkerIcon = marker => {
    if (eventSelected && eventSelected === marker.id) {
      return L.icon({
        iconUrl: '/svg/marker-red.svg',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -40],
      })
    }

    return L.icon({
      iconUrl: '/svg/marker.svg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })
  }

  const markersGroup = []

  if (markers && markers.edges && markers.edges.length > 0) {
    markers.edges
      .filter(Boolean)
      .map(edge => edge.node)
      .filter(Boolean)
      .map(marker => {
        if (marker.googleMapsAddress) {
          markersGroup.push(L.latLng(marker.googleMapsAddress.lat, marker.googleMapsAddress.lng))
        }
      })
  }

  const bounds = L.latLngBounds(markersGroup)
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {loading ? (
        <p
          style={{
            position: 'absolute',
            marginLeft: '-50px',
            left: '50%',
            top: '50%',
            color: '#000',
            zIndex: '1500',
          }}
        >
          <FormattedMessage id="global.loading" />
        </p>
      ) : null}

      <MapContainer
        bounds={bounds.isValid() ? formatBounds(bounds) : undefined}
        zoom={defaultMapOptions.zoom}
        maxZoom={MAX_MAP_ZOOM}
        preferCanvas
        id="event-map"
        style={
          loading
            ? {
                WebkitFilter: 'blur(5px)',
                zIndex: '0',
              }
            : {
                zIndex: '0',
              }
        }
        scrollWheelZoom={false}
        doubleClickZoom={false}
        gestureHandling={!isSafari}
        tap={false}
      >
        <CapcoTileLayer />
        <MarkerClusterGroup
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          zoomToBoundsOnClick
          onPopupClose={() => {
            dispatch(changeEventSelected(null))
          }}
          maxClusterRadius={30}
        >
          {markers &&
            markers.edges &&
            markers.edges.length > 0 &&
            markers.edges
              .filter(Boolean)
              .map(edge => edge.node)
              .filter(Boolean)
              .map(marker =>
                marker.googleMapsAddress ? (
                  <Marker
                    key={marker.id}
                    position={[marker.googleMapsAddress.lat, marker.googleMapsAddress.lng]}
                    icon={getMarkerIcon(marker)}
                  >
                    <Popup autoPanPadding={[50, 50]} maxWidth={250} minWidth={250}>
                      <EventMapPreview event={marker} />
                    </Popup>
                  </Marker>
                ) : null,
              )}
        </MarkerClusterGroup>
        <LocateControl />
      </MapContainer>
    </div>
  )
}
const Container = connect<any, any>()(LeafletMap)
export default createFragmentContainer(Container, {
  query: graphql`
    fragment LeafletMap_query on Query
    @argumentDefinitions(
      count: { type: "Int!" }
      cursor: { type: "String" }
      theme: { type: "ID" }
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
        project: $project
        locale: $locale
        search: $search
        userType: $userType
        isFuture: $isFuture
        author: $author
        isRegistrable: $isRegistrable
        orderBy: $orderBy
      ) @connection(key: "EventMap_events", filters: []) {
        edges {
          node {
            id
            googleMapsAddress {
              lat
              lng
            }
            ...EventMapPreview_event
          }
        }
      }
    }
  `,
})
