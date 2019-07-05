// @flow
import * as React from 'react';
import styled from 'styled-components';

const SvgComponent = styled.svg`
  fill: currentColor;
  stroke-width: 0;
  vertical-align: middle;
`;

type Props = {
  name: string,
  size?: number,
  title?: string,
  description?: string,
};

// All provided path must be cleaned with https://www.smooth-code.com/open-source/svgr/playground/
const Icon = ({ name, size, title, description, ...rest }: Props) => {
  let svgPath = null;

  switch (name) {
    case 'link':
      svgPath = (
        <path d="M27.333 12a2.666 2.666 0 00-2.666-2.667h-4.334a.333.333 0 00-.333.334v2c0 .184.15.333.333.333H24c.368 0 .667.299.667.667v16a.667.667 0 01-.667.666H8a.667.667 0 01-.667-.666v-16c0-.368.299-.667.667-.667h3.667c.184 0 .333-.15.333-.333V9.665a.333.333 0 00-.335-.332H7.334A2.666 2.666 0 004.666 12v17.333A2.666 2.666 0 007.333 32h17.334a2.666 2.666 0 002.666-2.667V12zM14 14.667a2 2 0 004 0V7.665c0-.184.15-.333.333-.333h2.334a1.334 1.334 0 00.933-2.276L16.933.389a1.334 1.334 0 00-1.885 0l-4.667 4.667a1.333 1.333 0 00.952 2.277h2.334c.184 0 .333.15.333.334v7z" />
      );
      break;
    case 'email':
      svgPath = (
        <path d="M31.85 7.776a.242.242 0 00-.266.052L18.588 20.821a3.667 3.667 0 01-5.184 0L.414 7.828a.24.24 0 00-.267-.052A.244.244 0 000 8v16a2.666 2.666 0 002.667 2.667h26.666A2.666 2.666 0 0032 24V8a.241.241 0 00-.15-.224zM14.82 19.408a1.67 1.67 0 002.357 0L30.092 6.493a.665.665 0 00.161-.681c-.146-.439-.554-.479-.92-.479H2.667c-.367 0-.778.04-.922.479a.665.665 0 00.162.681L14.82 19.408z" />
      );
      break;
    case 'google':
      svgPath = (
        <path d="M8.133 9.867a.666.666 0 00.907-.08c3.435-3.844 9.335-4.175 13.179-.74.201.18.396.369.581.566a.667.667 0 00.943.004l.004-.004L27.64 5.96a.667.667 0 00.004-.943l-.004-.004C21.581-1.419 11.455-1.72 5.023 4.337c-.407.383-.792.787-1.156 1.21A.666.666 0 004 6.533l4.133 3.334zM6.987 19.72a.666.666 0 00.186-.707 9.195 9.195 0 010-5.946.669.669 0 00-.213-.734L2.6 8.853a.667.667 0 00-1.013.227 15.908 15.908 0 00.2 14.2.667.667 0 001.04.187l4.16-3.747zM32 14a.667.667 0 00-.667-.667H18a.667.667 0 00-.667.667v5.333c0 .368.299.667.667.667h6.453a9.1 9.1 0 01-1.52 2.227.666.666 0 000 .893l3.56 4a.666.666 0 00.974 0A15.998 15.998 0 0032 16.8V14zM20.693 24.613a.666.666 0 00-.773-.16 9.24 9.24 0 01-10.8-2.173.666.666 0 00-.933 0l-4 3.573a.667.667 0 00-.004.943l.004.004a16 16 0 0020 3 .667.667 0 00.16-1.013l-3.654-4.174z" />
      );
      break;
    case 'facebook':
      svgPath = (
        <path d="M24.187 9.56a.667.667 0 00-.494-.227h-5.026v-1.88c0-.373.08-.8.68-.8h4a.584.584 0 00.466-.2A.668.668 0 0024 6V.667A.667.667 0 0023.333 0H17.56c-6.4 0-6.893 5.467-6.893 7.133v2.2H7.333a.667.667 0 00-.666.667v5.333c0 .368.298.667.666.667h3.334v15.333c0 .368.298.667.666.667H18a.667.667 0 00.667-.667V16h4.466a.667.667 0 00.667-.6l.56-5.333a.663.663 0 00-.173-.507z" />
      );
      break;
    case 'twitter':
      svgPath = (
        <path d="M31.093 8.587a.668.668 0 00-.266-1.16l-1.054-.267a.667.667 0 01-.44-.933l.587-1.187a.668.668 0 00-.773-.933l-2.667.746a.669.669 0 01-.587-.106 6.666 6.666 0 00-10.666 5.333v.48a.333.333 0 01-.294.333c-3.746.44-7.333-1.466-11.2-5.92a.677.677 0 00-.68-.2.667.667 0 00-.386.56 10.1 10.1 0 00.613 6.56.334.334 0 01-.347.48L1.44 12.08a.667.667 0 00-.76.787 6.867 6.867 0 003.16 5.04.334.334 0 010 .6l-.707.28a.667.667 0 00-.346.92 5.812 5.812 0 004.266 3.306.333.333 0 010 .627 14.589 14.589 0 01-5.72 1.107.68.68 0 00-.266 1.333 26.75 26.75 0 0010.853 2.573c3.305.051 6.553-.877 9.333-2.666a16.667 16.667 0 007.414-13.907v-1.16a.665.665 0 01.24-.507l2.186-1.826z" />
      );
      break;
    case 'linkedin':
      svgPath = (
        <path d="M3.333 11.333h5.334c.368 0 .666.299.666.667v17.333a.667.667 0 01-.666.667H3.333a.667.667 0 01-.666-.667V12c0-.368.298-.667.666-.667zM5.973 2C7.8 2 9.28 3.492 9.28 5.333S7.8 8.667 5.973 8.667 2.667 7.175 2.667 5.333 4.147 2 5.973 2zm18.694 28h4a.667.667 0 00.666-.667v-11.2c0-5.026-2.84-7.466-6.813-7.466a5.616 5.616 0 00-4.227 1.693.547.547 0 01-.96-.36.667.667 0 00-.666-.667h-4A.667.667 0 0012 12v17.333c0 .368.299.667.667.667h4a.667.667 0 00.666-.667v-10a3.333 3.333 0 116.667 0v10c0 .368.299.667.667.667z" />
      );
      break;
    default:
  }

  return (
    <SvgComponent
      viewBox="0 0 32 32"
      height={size}
      width={size}
      aria-hidden={title ? 'false' : 'true'}
      focusable="false"
      {...rest}>
      {title && <title>{title}</title>}
      {description && <desc>{description}</desc>}
      {svgPath}
    </SvgComponent>
  );
};

Icon.defaultProps = {
  size: 32,
};

export default Icon;