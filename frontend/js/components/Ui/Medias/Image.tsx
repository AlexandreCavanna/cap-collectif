import React, { PureComponent } from 'react'

import styled from 'styled-components'
import config, { baseUrl } from '../../../config'

type Props = {
  width: string
  height: string
  objectFit: string
  alt: string
  src: string | null | undefined
  className?: string
  fallBack?: string
  onError?: () => {}
  ariaHidden?: boolean
}
type State = {
  noImageAvailable: boolean
}
export const Container = styled.img<Props>`
  width: ${props => props.width};
  height: ${props => props.height};
  object-fit: ${props => props.objectFit};
`
const myFallBack = `${baseUrl}/svg/fallbackDev.svg`
export class Image extends PureComponent<Props, State> {
  static defaultProps = {
    objectFit: 'cover',
    width: 'auto',
    height: 'auto',
    alt: '',
  }

  constructor(props: Props) {
    super(props)
    const { src } = this.props
    this.state = {
      noImageAvailable: !src,
    }
  }

  handleError = () => {
    this.setState({
      noImageAvailable: true,
    })
  }

  render() {
    const { width, height, objectFit, alt, src, className, ariaHidden, fallBack } = this.props
    const { noImageAvailable } = this.state
    const shownFallBack = !fallBack && config.isDev ? myFallBack : fallBack
    return (
      <Container
        className={className}
        src={noImageAvailable ? shownFallBack : src}
        onError={this.handleError}
        width={width}
        height={height}
        objectFit={objectFit}
        alt={alt}
        aria-hidden={ariaHidden}
      />
    )
  }
}
export default Image
