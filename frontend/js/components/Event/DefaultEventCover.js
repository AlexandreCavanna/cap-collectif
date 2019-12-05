// @flow
import React from 'react';

type DefaultEventCoverProps = {
  width?: string,
  height?: string,
};

const DefaultEventCover = ({ width = '100%', height = '100%' }: DefaultEventCoverProps) => (
  <svg width={width} height={height}>
    <title>event-placeholder</title>
    <defs>
      <path id="prefix__b" d="M0 0h457v191H0z" />
      <path id="prefix__d" d="M0 0h457v192H0z" />
      <path id="prefix__f" d="M0 0h542v197H0z" />
      <filter
        x="-2.6%"
        y="-6.3%"
        width="105.3%"
        height="112.6%"
        filterUnits="objectBoundingBox"
        id="prefix__a">
        <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation={2} in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#prefix__a)" fill="none" fillRule="evenodd">
      <mask id="prefix__c" fill="#fff">
        <use xlinkHref="#prefix__b" />
      </mask>
      <path stroke="#E3E3E3" d="M.5.5v190h456V.5H.5z" />
      <g mask="url(#prefix__c)">
        <g transform="translate(-1)">
          <mask id="prefix__e" fill="#fff">
            <use xlinkHref="#prefix__d" />
          </mask>
          <use fill="#878A8C" fillRule="nonzero" xlinkHref="#prefix__d" />
          <g mask="url(#prefix__e)">
            <g transform="translate(-42 -2)">
              <mask id="prefix__g" fill="#fff">
                <use xlinkHref="#prefix__f" />
              </mask>
              <use fill="#D3D3D3" xlinkHref="#prefix__f" />
              <g mask="url(#prefix__g)">
                <path
                  d="M548.756-68.013c-64.618-10.007-128.948 4.9-192.99 44.722-28.518 17.734-190.036-1.702-230.932 12.206C27.978 21.855 48.574 79.07-16.034 79.07l234.976 3.712h329.814V-68.013z"
                  fill="#DBE1E7"
                />
                <path
                  d="M-40.119-3.225C14.181-32.82 71.79-29.787 132.705 5.877c46.322 27.121 202.834 48.698 254.004 64.092 49.765 14.97 84.703 60.14 130.007 60.14H-48.177L-40.12-3.226z"
                  fill="#C9CFD5"
                />
                <path
                  d="M548.756 42.847c-42.01-9.409-95.036 6.157-159.078 46.698-28.519 18.054-185.352 14.572-226.248 28.732-96.856 33.534-114.857 74.309-179.464 74.309l234.976 3.779h329.814V42.847z"
                  fill="#B8BEC4"
                />
                <path
                  d="M-40.119 80.289c52.976-8.8 109.921 4.54 170.836 40.02 46.323 26.98 215.416 30.906 266.587 46.22 49.765 14.892 119.012 46.4 164.315 46.4H-48.177l8.058-132.64z"
                  fill="#A9AFB4"
                />
              </g>
            </g>
            <path
              d="M263.737 63.419h-10.2a.928.928 0 01-.928-.929v-6.5a3.712 3.712 0 00-3.71-3.714 3.712 3.712 0 00-3.709 3.714v17.644a2.784 2.784 0 01-2.782 2.786 2.784 2.784 0 01-2.782-2.786v-8.358c0-1.025-.83-1.857-1.855-1.857h-23.183a.928.928 0 01-.927-.925V55.99a3.712 3.712 0 00-3.71-3.714 3.712 3.712 0 00-3.709 3.714v17.644a2.784 2.784 0 01-2.782 2.786 2.784 2.784 0 01-2.782-2.786v-8.358c0-1.025-.83-1.857-1.855-1.857h-5.564c-4.097 0-7.418 3.326-7.418 7.429v63.147c0 4.103 3.321 7.429 7.418 7.429h70.478c4.097 0 7.419-3.326 7.419-7.43V70.849c0-4.103-3.322-7.429-7.42-7.429zm0 68.718c0 1.026-.83 1.858-1.855 1.858h-66.768a1.856 1.856 0 01-1.855-1.858V87.563c0-1.025.83-1.857 1.855-1.857h66.768c1.025 0 1.855.832 1.855 1.857v44.574zm-51.93-40.86h-3.71a3.712 3.712 0 00-3.71 3.715 3.712 3.712 0 003.71 3.715h3.71a3.712 3.712 0 003.708-3.715 3.712 3.712 0 00-3.709-3.714zm18.546 0h-3.71a3.712 3.712 0 00-3.709 3.715 3.712 3.712 0 003.71 3.715h3.709a3.712 3.712 0 003.71-3.715 3.712 3.712 0 00-3.71-3.714zm18.547 0h-3.71a3.712 3.712 0 00-3.71 3.715 3.712 3.712 0 003.71 3.715h3.71a3.712 3.712 0 003.709-3.715 3.712 3.712 0 00-3.71-3.714zm-37.094 14.859h-3.71a3.712 3.712 0 00-3.709 3.714 3.712 3.712 0 003.71 3.715h3.71a3.712 3.712 0 003.708-3.715 3.712 3.712 0 00-3.709-3.714zm18.547 0h-3.71a3.712 3.712 0 00-3.709 3.714 3.712 3.712 0 003.71 3.715h3.709a3.712 3.712 0 003.71-3.715 3.712 3.712 0 00-3.71-3.714zm18.547 0h-3.71a3.712 3.712 0 00-3.71 3.714 3.712 3.712 0 003.71 3.715h3.71a3.712 3.712 0 003.709-3.715 3.712 3.712 0 00-3.71-3.714zm-37.094 14.858h-3.71a3.712 3.712 0 00-3.709 3.714 3.712 3.712 0 003.71 3.715h3.71a3.712 3.712 0 003.708-3.715 3.712 3.712 0 00-3.709-3.714zm18.547 0h-3.71a3.712 3.712 0 00-3.709 3.714 3.712 3.712 0 003.71 3.715h3.709a3.712 3.712 0 003.71-3.715 3.712 3.712 0 00-3.71-3.714zm18.547 0h-3.71a3.712 3.712 0 00-3.71 3.714 3.712 3.712 0 003.71 3.715h3.71a3.712 3.712 0 003.709-3.715 3.712 3.712 0 00-3.71-3.714z"
              fill="#FFF"
              fillRule="nonzero"
              opacity={0.797}
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default DefaultEventCover;
