// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

type Props = {
  width?: number,
  height?: number,
  objectFit?: string,
  alt: string,
  src: string,
};

export const Container = styled.img`
  width: ${props => props.width};
  height: ${props => props.height};
  object-fit: ${props => props.objectFit};
`;

export default class Image extends PureComponent<Props> {
  static defaultProps = {
    objectFit: 'cover',
    width: 'auto',
    height: 'auto',
  };

  render() {
    const { width, height, objectFit, alt, src } = this.props;

    return <Container src={src} width={width} height={height} objectFit={objectFit} alt={alt} />;
  }
}
