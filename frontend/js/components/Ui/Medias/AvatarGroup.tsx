import * as React from 'react'
import type { StyledComponent } from 'styled-components'
import styled, { css } from 'styled-components'
import colors from '../../../utils/colors'
import { avatarNb } from '../../../utils/sizes'

type Props = {
  children?: Array<React.ReactElement<any>>
  childrenSize: 'small' | 'normal'
}
type CssProps = {
  children?: Array<React.ReactElement<any>>
  childrenSize: number
}

const createCSS = (props: CssProps) => {
  const { childrenSize, children } = props
  let styles = ''

  if (children) {
    for (let i = 1; i < children.length; i += 1) {
      styles += `
       & > *:nth-child(${i + 1}) {
         z-index: ${children.length - i};
         left: ${(childrenSize / 2 + 10) * i}px;
       }
     `
    }
  }

  return css`
    ${styles}
  `
}

export const Container: StyledComponent<Props, {}, HTMLDivElement> = styled.div.attrs({
  className: 'avatar-group',
})`
  position: relative;
  overflow: hidden;

  & > *:first-child {
    position: relative;
    z-index: ${props => props.length};
  }

  & > *:not(:first-child) {
    position: absolute;
  }

  img,
  svg {
    border: 1.5px solid ${colors.white};
  }

  ${props => createCSS(props)}
`
export class AvatarGroup extends React.Component<Props> {
  static defaultProps = {
    childrenSize: 'normal',
  }

  render() {
    const { children, childrenSize } = this.props
    const getChildrenSize = avatarNb[childrenSize]

    if (!children) {
      return null
    }

    return (
      <Container childrenSize={getChildrenSize} length={children.length}>
        {children}
      </Container>
    )
  }
}
export default AvatarGroup
