import React from 'react'

const DefaultEventCover = ({ isMobile }: { isMobile?: boolean }) =>
  isMobile ? (
    <svg viewBox="0 0 180 120">
      <defs>
        <path id="prefix__a" d="M0 0h306v121H0z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d="M-63-1h306v121H-63z" fill="#D3D3D3" fillRule="nonzero" />
        <g transform="translate(-63 -1)">
          <mask id="prefix__b" fill="#fff">
            <use xlinkHref="#prefix__a" />
          </mask>
          <g fillRule="nonzero" mask="url(#prefix__b)">
            <path
              d="M309.967-41.671c-36.484-6.166-72.805 3.018-108.964 27.552C184.901-3.194 93.706-15.168 70.615-6.6 15.93 13.694 27.558 48.944-8.92 48.944l132.67 2.286h186.217V-41.67z"
              fill="#DBE1E7"
            />
            <path
              d="M-22.519-1.757C8.14-19.99 40.666-18.12 75.059 3.851c26.155 16.708 114.523 30.002 143.415 39.485 28.098 9.223 47.824 37.051 73.403 37.051H-27.07l4.55-82.144z"
              fill="#C9CFD5"
            />
            <path
              d="M309.967 26.627c-23.72-5.796-53.659 3.793-89.817 28.77-16.102 11.123-104.652 8.977-127.743 17.7-54.686 20.66-64.85 45.781-101.327 45.781l132.67 2.328h186.217V26.627z"
              fill="#B8BEC4"
            />
            <path
              d="M-22.519 49.694c29.91-5.42 62.063 2.797 96.456 24.655 26.155 16.622 121.627 19.041 150.518 28.476 28.098 9.175 67.196 28.586 92.775 28.586h-344.3l4.551-81.717z"
              fill="#A9AFB4"
            />
          </g>
        </g>
        <g fill="#FFF" fillRule="nonzero">
          <path d="M82.063 56.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM91.438 56.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM100.813 56.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM82.063 64.188h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM91.438 64.188h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM100.813 64.188h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM82.063 71.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM91.438 71.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM100.813 71.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75z" />
          <path d="M108.313 42.625h-5.157a.469.469 0 01-.469-.469v-3.281a1.875 1.875 0 00-3.75 0v8.906a1.406 1.406 0 01-2.812 0v-4.218a.937.937 0 00-.938-.938H83.47a.469.469 0 01-.469-.467v-3.283a1.875 1.875 0 00-3.75 0v8.906a1.406 1.406 0 01-2.813 0v-4.218a.938.938 0 00-.937-.938h-2.813a3.75 3.75 0 00-3.75 3.75V78.25a3.75 3.75 0 003.75 3.75h35.626a3.75 3.75 0 003.75-3.75V46.375a3.75 3.75 0 00-3.75-3.75zm0 34.688c0 .517-.42.937-.938.937h-33.75a.937.937 0 01-.938-.938v-22.5c0-.517.42-.937.938-.937h33.75c.518 0 .938.42.938.938v22.5z" />
        </g>
      </g>
    </svg>
  ) : (
    <svg viewBox="0 0 260 83">
      <defs>
        <path id="prefix__a" d="M0 0h260v83H0z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d="M0 0h260v83H0z" fill="#D3D3D3" fillRule="nonzero" />
        <mask id="prefix__b" fill="#fff">
          <use xlinkHref="#prefix__a" />
        </mask>
        <g fillRule="nonzero" mask="url(#prefix__b)">
          <path
            d="M263.371-28.584c-31-4.23-61.861 2.07-92.584 18.899C157.105-2.191 79.619-10.405 60-4.527c-46.465 13.92-36.585 38.1-67.58 38.1l112.727 1.568h158.224v-63.725z"
            fill="#DBE1E7"
          />
          <path
            d="M-19.134-1.205c26.05-12.507 53.687-11.225 82.91 3.846 22.222 11.462 97.307 20.58 121.855 27.086C209.505 36.053 226.266 55.14 248 55.14H-23l3.866-56.346z"
            fill="#C9CFD5"
          />
          <path
            d="M263.371 18.265c-20.154-3.976-45.593 2.602-76.316 19.735-13.681 7.63-88.92 6.158-108.539 12.141C32.051 64.313 23.415 81.545-7.579 81.545l112.726 1.596h158.224V18.265z"
            fill="#B8BEC4"
          />
          <path
            d="M-19.134 34.088C6.281 30.369 33.6 36.007 62.823 51c22.222 11.402 103.342 13.061 127.89 19.533 23.875 6.293 57.095 19.608 78.829 19.608H-23l3.866-56.053z"
            fill="#A9AFB4"
          />
        </g>
        <g fill="#FFF" fillRule="nonzero">
          <path d="M122.063 37.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM131.438 37.688h-1.875a1.875 1.875 0 000 3.75h1.875a1.875 1.875 0 000-3.75zM140.813 37.688h-1.875a1.875 1.875 0 000 3.75h1.875a1.875 1.875 0 000-3.75zM122.063 45.188h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM131.438 45.188h-1.875a1.875 1.875 0 000 3.75h1.875a1.875 1.875 0 000-3.75zM140.813 45.188h-1.875a1.875 1.875 0 000 3.75h1.875a1.875 1.875 0 000-3.75zM122.063 52.688h-1.876a1.875 1.875 0 000 3.75h1.876a1.875 1.875 0 000-3.75zM131.438 52.688h-1.875a1.875 1.875 0 000 3.75h1.875a1.875 1.875 0 000-3.75zM140.813 52.688h-1.875a1.875 1.875 0 000 3.75h1.875a1.875 1.875 0 000-3.75z" />
          <path d="M148.313 23.625h-5.157a.469.469 0 01-.469-.469v-3.281a1.875 1.875 0 00-3.75 0v8.906a1.406 1.406 0 01-2.812 0v-4.218a.937.937 0 00-.938-.938H123.47a.469.469 0 01-.469-.467v-3.283a1.875 1.875 0 00-3.75 0v8.906a1.406 1.406 0 01-2.813 0v-4.218a.938.938 0 00-.937-.938h-2.813a3.75 3.75 0 00-3.75 3.75V59.25a3.75 3.75 0 003.75 3.75h35.626a3.75 3.75 0 003.75-3.75V27.375a3.75 3.75 0 00-3.75-3.75zm0 34.688c0 .517-.42.937-.938.937h-33.75a.937.937 0 01-.938-.938v-22.5c0-.517.42-.937.938-.937h33.75c.518 0 .938.42.938.938v22.5z" />
        </g>
      </g>
    </svg>
  )

export default DefaultEventCover