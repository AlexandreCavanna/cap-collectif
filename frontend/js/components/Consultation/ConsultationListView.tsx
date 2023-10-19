import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import type { ConsultationListView_consultations } from '~relay/ConsultationListView_consultations.graphql'
import ConsultationPreview from './Preview/ConsultationPreview'
type RelayProps = {
  readonly consultations: ConsultationListView_consultations
}
type Props = RelayProps
export const ConsultationListView = ({ consultations }: Props) => {
  return (
    <div className="row consultation__list">
      <div className="d-flex flex-wrap">
        {consultations.edges &&
          consultations.edges
            .filter(Boolean)
            .map(edge => edge.node)
            .filter(Boolean)
            .map(consultation => <ConsultationPreview key={consultation.id} consultation={consultation} />)}
      </div>
    </div>
  )
}
export default createFragmentContainer(ConsultationListView, {
  consultations: graphql`
    fragment ConsultationListView_consultations on ConsultationConnection {
      edges {
        node {
          id
          ...ConsultationPreview_consultation
        }
      }
    }
  `,
})
