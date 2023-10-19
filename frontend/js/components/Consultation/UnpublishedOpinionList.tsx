import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Opinion from './Opinion'
import type { UnpublishedOpinionList_consultation } from '~relay/UnpublishedOpinionList_consultation.graphql'
import ListGroup from '../Ui/List/ListGroup'
type Props = {
  readonly consultation: UnpublishedOpinionList_consultation
}
export class UnpublishedOpinionList extends React.Component<Props> {
  render() {
    const { consultation } = this.props

    if (
      !consultation.viewerOpinionsUnpublished ||
      consultation.viewerOpinionsUnpublished.totalCount === 0 ||
      !consultation.viewerOpinionsUnpublished.edges ||
      !consultation.viewerOpinionsUnpublished.edges[0] ||
      !consultation.viewerOpinionsUnpublished.edges[0].node
    ) {
      return null
    }

    const { notPublishedReason } = consultation.viewerOpinionsUnpublished.edges[0].node
    return (
      <Panel bsStyle="danger" className="panel-custom">
        <Panel.Heading>
          <Panel.Title>
            <strong>
              <FormattedMessage
                id="count-proposal"
                values={{
                  num: consultation.viewerOpinionsUnpublished.totalCount,
                }}
              />
            </strong>{' '}
            <FormattedMessage
              id={
                notPublishedReason === 'WAITING_AUTHOR_CONFIRMATION'
                  ? 'awaiting-publication-lowercase'
                  : 'unpublished-lowercase'
              }
              values={{
                num: consultation.viewerOpinionsUnpublished.totalCount,
              }}
            />
          </Panel.Title>
        </Panel.Heading>
        <ListGroup>
          {consultation.viewerOpinionsUnpublished &&
            consultation.viewerOpinionsUnpublished.edges &&
            consultation.viewerOpinionsUnpublished.edges
              .filter(Boolean)
              .map(edge => edge.node)
              .filter(Boolean)
              .map((opinion, index) => <Opinion key={index} opinion={opinion} />)}
        </ListGroup>
      </Panel>
    )
  }
}
export default createFragmentContainer(UnpublishedOpinionList, {
  consultation: graphql`
    fragment UnpublishedOpinionList_consultation on Consultation {
      viewerOpinionsUnpublished(first: 100) {
        totalCount
        edges {
          node {
            id
            notPublishedReason
            ...Opinion_opinion
          }
        }
      }
    }
  `,
})
