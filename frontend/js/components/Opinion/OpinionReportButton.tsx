import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { connect } from 'react-redux'
import { submitReport } from '~/redux/modules/report'
import ReportBox from '../Report/ReportBox'
import type { OpinionReportButton_opinion } from '~relay/OpinionReportButton_opinion.graphql'

type Props = {
  dispatch: (...args: Array<any>) => any
  opinion: OpinionReportButton_opinion
}

class OpinionReportButton extends React.Component<Props> {
  handleReport = (data: Record<string, any>) => {
    const { opinion, dispatch } = this.props

    if (opinion.id) {
      return submitReport(opinion.id, data, dispatch, 'alert.success.report.proposal')
    }
  }

  render() {
    const { opinion } = this.props

    if (!opinion || !opinion.author || !opinion.id) {
      return null
    }

    return (
      <ReportBox
        id={`opinion-${opinion.id}`}
        reported={opinion.viewerHasReport || false}
        onReport={this.handleReport}
        author={{
          uniqueId: opinion.author.slug,
        }}
        buttonClassName="btn--default opinion__action--report"
        buttonStyle={{
          marginRight: 5,
        }}
      />
    )
  }
}

// @ts-ignore
const container = connect<any, any>()(OpinionReportButton)
export default createFragmentContainer(container, {
  opinion: graphql`
    fragment OpinionReportButton_opinion on OpinionOrVersion
    @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      ... on Opinion {
        id
        viewerHasReport @include(if: $isAuthenticated)
        author {
          slug
        }
      }
      ... on Version {
        id
        viewerHasReport @include(if: $isAuthenticated)
        author {
          slug
        }
        parent {
          id
        }
      }
    }
  `,
})
