import React, { PureComponent } from 'react'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { Media as MediaBtsp } from 'react-bootstrap'

type Props = {
  children?: any
}
export const Container: StyledComponent<any, {}, typeof MediaBtsp.Left> = styled(MediaBtsp.Left)`
  img,
  svg {
    margin-right: 10px;
  }
`
export default class Left extends PureComponent<Props> {
  render() {
    const { children } = this.props
    return <Container>{children}</Container>
  }
}
