// @flow
import styled from 'styled-components';

const Cover = styled.div.attrs({
  className: 'card-cover',
})`
  overflow: hidden;
  height: 175px;

  img {
    width: 100%;
    object-fit: cover;
    height: 100%;
  }
`;

export default Cover;
