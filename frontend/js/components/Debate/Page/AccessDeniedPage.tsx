import * as React from 'react'
import { useIntl } from 'react-intl'
import { Flex, Box, Text } from '@cap-collectif/ui'

const AccessDeniedPage = (): JSX.Element => {
  const intl = useIntl()
  const image = (
    <svg width="251" height="250" viewBox="0 0 251 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M125.5 225C180.728 225 225.5 180.228 225.5 125C225.5 69.7715 180.728 25 125.5 25C70.2715 25 25.5 69.7715 25.5 125C25.5 180.228 70.2715 225 125.5 225Z"
        fill="#E0EFFF"
      />
      <path
        d="M179.917 108.565C180.284 109.11 180.48 109.753 180.48 110.41C180.48 111.067 180.284 111.71 179.917 112.255C174.5 120.318 150.68 152.068 111.675 152.068C72.67 152.068 48.8525 120.318 43.425 112.255C43.0593 111.709 42.8641 111.067 42.8641 110.41C42.8641 109.753 43.0593 109.111 43.425 108.565C48.8525 100.5 72.67 68.75 111.675 68.75C150.68 68.75 174.5 100.5 179.917 108.565Z"
        fill="white"
      />
      <path
        d="M111.675 140.165C128.108 140.165 141.43 126.843 141.43 110.41C141.43 93.9768 128.108 80.655 111.675 80.655C95.2418 80.655 81.92 93.9768 81.92 110.41C81.92 126.843 95.2418 140.165 111.675 140.165Z"
        fill="#C2DFFF"
      />
      <path
        d="M179.917 108.565C180.284 109.11 180.48 109.753 180.48 110.41C180.48 111.067 180.284 111.71 179.917 112.255C174.5 120.318 150.68 152.068 111.675 152.068C72.67 152.068 48.8525 120.318 43.425 112.255C43.0593 111.709 42.8641 111.067 42.8641 110.41C42.8641 109.753 43.0593 109.111 43.425 108.565C48.8525 100.5 72.67 68.75 111.675 68.75C150.68 68.75 174.5 100.5 179.917 108.565Z"
        stroke="#003670"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M111.675 140.165C128.108 140.165 141.43 126.843 141.43 110.41C141.43 93.9768 128.108 80.655 111.675 80.655C95.2418 80.655 81.92 93.9768 81.92 110.41C81.92 126.843 95.2418 140.165 111.675 140.165Z"
        stroke="#003670"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M111.675 121.982C118.066 121.982 123.248 116.801 123.248 110.41C123.248 104.019 118.066 98.8375 111.675 98.8375C105.284 98.8375 100.103 104.019 100.103 110.41C100.103 116.801 105.284 121.982 111.675 121.982Z"
        fill="white"
      />
      <path
        d="M111.675 121.982C118.066 121.982 123.248 116.801 123.248 110.41C123.248 104.019 118.066 98.8375 111.675 98.8375C105.284 98.8375 100.103 104.019 100.103 110.41C100.103 116.801 105.284 121.982 111.675 121.982Z"
        stroke="#003670"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M111.675 177.518C129.141 177.518 143.3 175.587 143.3 173.205C143.3 170.823 129.141 168.893 111.675 168.893C94.209 168.893 80.05 170.823 80.05 173.205C80.05 175.587 94.209 177.518 111.675 177.518Z"
        fill="#C2DFFF"
      />
      <path
        d="M198.785 135.688H145.45C143.982 135.688 142.792 136.877 142.792 138.345V178.9C142.792 180.368 143.982 181.558 145.45 181.558H198.785C200.253 181.558 201.442 180.368 201.442 178.9V138.345C201.442 136.877 200.253 135.688 198.785 135.688Z"
        fill="#C2DFFF"
      />
      <path
        d="M148.658 135.688V124.937C148.657 121.728 149.289 118.55 150.517 115.585C151.745 112.62 153.545 109.926 155.814 107.657C158.084 105.388 160.778 103.588 163.743 102.36C166.708 101.132 169.886 100.5 173.095 100.5C176.304 100.5 179.482 101.132 182.446 102.36C185.411 103.588 188.105 105.388 190.374 107.658C192.643 109.927 194.443 112.621 195.671 115.586C196.899 118.551 197.53 121.728 197.53 124.937V135.688H187.75V124.937C187.75 121.049 186.205 117.319 183.455 114.57C180.706 111.82 176.976 110.275 173.088 110.275C169.199 110.275 165.469 111.82 162.72 114.57C159.97 117.319 158.425 121.049 158.425 124.937V135.688H148.658Z"
        fill="white"
        stroke="#003670"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M198.785 135.688H145.45C143.982 135.688 142.792 136.877 142.792 138.345V178.9C142.792 180.368 143.982 181.558 145.45 181.558H198.785C200.253 181.558 201.442 180.368 201.442 178.9V138.345C201.442 136.877 200.253 135.688 198.785 135.688Z"
        stroke="#003670"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M179.938 155.165C179.942 153.939 179.617 152.735 178.997 151.678C178.377 150.621 177.484 149.75 176.412 149.156C175.34 148.562 174.129 148.266 172.904 148.3C171.678 148.335 170.485 148.697 169.448 149.351C168.411 150.004 167.569 150.924 167.009 152.014C166.449 153.104 166.192 154.324 166.265 155.548C166.338 156.771 166.738 157.953 167.424 158.968C168.109 159.984 169.055 160.797 170.163 161.322V164.94C170.163 165.718 170.471 166.464 171.021 167.014C171.571 167.564 172.317 167.872 173.095 167.872C173.873 167.872 174.619 167.564 175.169 167.014C175.719 166.464 176.028 165.718 176.028 164.94V161.322C177.195 160.771 178.182 159.9 178.874 158.81C179.567 157.72 179.935 156.456 179.938 155.165Z"
        fill="white"
        stroke="#003670"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
  return (
    <Flex direction="column" alignItems="center" backgroundColor="gray.100" height="100vh">
      <Box mt={9}>
        <Text textAlign="center" fontSize={6} fontWeight={600} mb={4}>
          {intl.formatMessage({
            id: 'we-are-sorry',
          })}
        </Text>
        <Text textAlign="center" fontSize={5}>
          {intl.formatMessage({
            id: 'page-access-denied',
          })}
        </Text>
      </Box>
      <Flex justifyContent="center">{image}</Flex>
    </Flex>
  )
}

export default AccessDeniedPage
