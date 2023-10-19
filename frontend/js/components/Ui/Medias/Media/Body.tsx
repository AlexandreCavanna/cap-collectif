import React, { PureComponent } from 'react'
import { Media as MediaBtsp } from 'react-bootstrap'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import colors from '../../../../utils/colors'

type Props = {
  children?: any
  className?: string
}
export const Container: StyledComponent<any, {}, typeof MediaBtsp.Body> = styled(MediaBtsp.Body)`
  flex: 1;
  overflow: auto;

  a.excerpt:hover {
    color: ${colors.darkGray};
  }
`
export default class Body extends PureComponent<Props> {
  render() {
    const { children, className } = this.props
    return <Container className={className}>{children}</Container>
  }
}
