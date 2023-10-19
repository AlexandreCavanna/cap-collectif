import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { Panel } from 'react-bootstrap'
import colors from '~/utils/colors'
import { MAIN_BORDER_RADIUS } from '~/utils/styles/variables'
import { getStyleSearchBarAddress } from '~/components/Form/Address/Address.style'

export const PanelHeader: StyledComponent<any, {}, typeof Panel.Heading> = styled(Panel.Heading)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  a {
    color: ${colors.blue};
  }
`
export const MapViewContent: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #fff;

  h5 {
    font-weight: 600;
    margin: 5px 0 20px 0;
    font-size: 16px;
  }
`
export const MapContainer: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  .map {
    width: 70%;
    height: 350px;
    ${MAIN_BORDER_RADIUS};
    margin-right: 10px;
    z-index: 0;
  }

  .fields {
    flex: 1;
  }

  .search-address {
    ${getStyleSearchBarAddress('left')};
  }
`
export const ButtonToggleView: StyledComponent<any, {}, HTMLButtonElement> = styled.button`
  background: none;
  border: none;
  padding: 0;
`
export const Error: StyledComponent<any, {}, HTMLSpanElement> = styled.span`
  color: ${colors.error};
`
