import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { ListGroupItem } from 'react-bootstrap'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import OpinionPreview from '../Opinion/OpinionPreview'
import type { OpinionVersion_version } from '~relay/OpinionVersion_version.graphql'
import colors from '../../utils/colors'
import PieChart from '../Ui/Chart/PieChart'

type Props = {
  version: OpinionVersion_version
  rankingThreshold?: number | null | undefined
  intl: IntlShape
  isProfile: boolean
}

class OpinionVersion extends React.Component<Props> {
  static defaultProps = {
    isProfile: false,
  }

  render() {
    const { version, rankingThreshold, isProfile, intl } = this.props
    const total = version.votesOk.totalCount + version.votesMitige.totalCount + version.votesNok.totalCount
    const okPercent = ((version.votesOk.totalCount / total) * 100).toFixed(2)
    const mitigePercent = ((version.votesMitige.totalCount / total) * 100).toFixed(2)
    const nokPercent = (100 - (Number(okPercent) + Number(mitigePercent))).toFixed(2)
    const data = [
      {
        name: intl.formatMessage({
          id: 'global.ok',
        }),
        value: version.votesOk.totalCount,
        percent: okPercent,
      },
      {
        name: intl.formatMessage({
          id: 'global.mitige',
        }),
        value: version.votesMitige.totalCount,
        percent: mitigePercent,
      },
      {
        name: intl.formatMessage({
          id: 'global.nok',
        }),
        value: version.votesNok.totalCount,
        percent: nokPercent,
      },
    ]
    return (
      <ListGroupItem
        className={`list-group-item__opinion opinion has-chart${version.author && version.author.vip ? ' bg-vip' : ''}`}
      >
        <div>
          <OpinionPreview opinion={version} rankingThreshold={rankingThreshold} isProfile={isProfile} />
        </div>
        {!isProfile && version.votes && version.votes.totalCount > 0 ? (
          <div className="hidden-xs">
            <PieChart data={data} colors={colors.votes} />
          </div>
        ) : null}
      </ListGroupItem>
    )
  }
}

const container = injectIntl(OpinionVersion)
export default createFragmentContainer(container, {
  version: graphql`
    fragment OpinionVersion_version on Version {
      ...OpinionPreview_opinion
      author {
        vip
      }
      votes(first: 0) {
        totalCount
      }
      votesOk: votes(first: 0, value: YES) {
        totalCount
      }
      votesNok: votes(first: 0, value: NO) {
        totalCount
      }
      votesMitige: votes(first: 0, value: MITIGE) {
        totalCount
      }
    }
  `,
})
