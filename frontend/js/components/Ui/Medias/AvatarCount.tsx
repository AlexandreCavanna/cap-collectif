import * as React from 'react'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import colors from '../../../utils/colors'
import { avatarPx } from '../../../utils/sizes'

type Props = {
  size: 'small' | 'normal'
  children: JSX.Element | JSX.Element[] | string
}
export const Container: StyledComponent<Props, {}, HTMLDivElement> = styled.div.attrs({
  className: 'avatar-count',
})`
  border-radius: 50%;
  height: ${props => props.size};
  width: ${props => props.size};
  background-color: ${colors.borderColor};
  color: ${colors.darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
`
export class AvatarCount extends React.Component<Props> {
  static defaultProps = {
    size: 'normal',
  }

  render() {
    const { size, children } = this.props
    const getSize = avatarPx[size]
    return <Container size={getSize}>{children}</Container>
  }
}
export default AvatarCount
