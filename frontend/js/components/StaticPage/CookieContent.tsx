import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import type { State } from '../../types'
import { baseUrl } from '../../config'

type Props = {
  analyticsJs: string | null | undefined
  adJs: string | null | undefined
  cookiesList: string
  cookiesList: string
}
type cookieType = {
  cookieType: number
  nbCookies: number
}

function getCookieType(analyticsJs: string | null | undefined, adJs: string | null | undefined): cookieType {
  if (analyticsJs && analyticsJs !== '' && (!adJs || adJs === '')) {
    return {
      cookieType: 0,
      nbCookies: 2,
    }
  }

  if (adJs && adJs !== '' && (!analyticsJs || analyticsJs === '')) {
    return {
      cookieType: 2,
      nbCookies: 2,
    }
  }

  if (adJs && adJs !== '' && analyticsJs && analyticsJs !== '') {
    return {
      cookieType: 3,
      nbCookies: 3,
    }
  }

  return {
    cookieType: -1,
    nbCookies: 1,
  }
}

export class CookieContent extends React.Component<Props, State> {
  render() {
    const { analyticsJs, adJs, cookiesList } = this.props
    const cookies = getCookieType(analyticsJs, adJs)
    const hasScript = analyticsJs || adJs
    return (
      <div>
        {cookies.cookieType > 0 ? (
          <div>
            <FormattedHTMLMessage
              id="cookies-page-texte-tmp-part1"
              values={{
                platformLink: baseUrl,
                cookieType: cookies.cookieType,
              }}
            />
          </div>
        ) : (
          <div>
            <FormattedHTMLMessage
              id="cookies-page-texte-part1"
              values={{
                platformLink: baseUrl,
              }}
            />
          </div>
        )}
        <FormattedHTMLMessage
          id={hasScript ? 'cookies-page-texte-part1-2' : 'cookies-page-texte-part1-2-noScript'}
          values={{
            platformLink: baseUrl,
          }}
        />
        <FormattedHTMLMessage
          id="cookies-page-texte-tmp-part1-3"
          values={{
            platformLink: baseUrl,
            nbCookies: cookies.nbCookies,
          }}
        />
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: cookiesList,
          }}
        />
        <FormattedHTMLMessage
          id="cookies-page-texte-part2"
          values={{
            platformLink: baseUrl,
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state: State) => ({
  analyticsJs: state.default.parameters['snalytical-tracking-scripts-on-all-pages'],
  adJs: state.default.parameters['ad-scripts-on-all-pages'],
  cookiesList: state.default.parameters['cookies-list'],
})

export default connect(mapStateToProps)(CookieContent)
