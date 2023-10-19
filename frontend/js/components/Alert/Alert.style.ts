import { $Values } from 'utility-types'
import styled from 'styled-components'
import { AlertColors } from '~/utils/colors'
import { TYPE_ALERT } from '~/constants/AlertConstants'

const AlertContainer = styled.div.attrs((props: { type: $Values<typeof TYPE_ALERT> }) => ({
  className: `alert alert-${props.type.toLowerCase()}`,
}))<{
  type: $Values<typeof TYPE_ALERT>
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  background-color: ${props => AlertColors[props.type].background};
  color: ${props => AlertColors[props.type].color};
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-weight: normal;

  & > span {
    padding-right: 26px;
    text-align: center;
  }

  button {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;

    svg,
    path {
      fill: ${props => AlertColors[props.type].color};
    }
  }
`
export default AlertContainer
