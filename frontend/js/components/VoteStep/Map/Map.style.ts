import styled from 'styled-components'

export const MapContainer = styled.div`
  position: sticky;
  top: 51px;

  .marker-cluster-small,
  .marker-cluster-medium,
  .marker-cluster-large {
    background: rgba(69, 69, 69, 0.3);
  }
  .marker-cluster-small div,
  .marker-cluster-medium div,
  .marker-cluster-large div {
    background: #454545;
  }

  .location-circle circle {
    animation: leaflet-control-locate-throb 2s infinite cubic-bezier(0.36, 0.11, 0.89, 0.32);
  }

  @keyframes leaflet-control-locate-throb {
    from {
      transform: scale(0.75, 0.75);
      opacity: 0.5;
    }
    to {
      transform: scale(2, 2);
      opacity: 0;
    }
  }

  .preview-icn svg {
    height: 30px !important;
    width: 30px !important;
    max-height: none !important;
    max-width: none !important;
    padding: 0 !important;
  }

  .preview-icn svg:nth-child(2) {
    position: absolute;
    top: 7px;
    left: 12px;
    pointer-events: none;
  }

  .preview-icn.active svg,
  .preview-icn > svg:hover,
  .preview-icn > svg:hover + svg {
    animation: expand-pin 0.1s forwards;
  }

  @keyframes expand-pin {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.2);
    }
  }

  /**
    Leaflet doesn't allow to natively center elements 
    https://github.com/Leaflet/Leaflet/issues/8358
  **/
  .leaflet-bottom.leaflet-left {
    left: 50%;
    transform: translate(-50%, 0%);
  }

  @media (max-width: 767px) {
    .leaflet-bottom.leaflet-left {
      transform: translate(-50%, -20px);
    }
  }

  @media (min-width: 768px) {
    .leaflet-bottom.leaflet-left {
      top: 1.7rem;
    }
    .leaflet-bottom.leaflet-left * {
      font-size: 14px;
      font-weight: bold;
    }
  }

  @media (min-width: 1366px) {
    .leaflet-bottom.leaflet-left {
      width: max-content;
    }
  }
`
