import * as React from 'react'
import { graphql, QueryRenderer } from 'react-relay'
import environment, { graphqlError } from '../../createRelayEnvironment'
import Loader from '../Ui/FeedbacksIndicators/Loader'
import type { RelayGlobalId } from '../../types'
import type { ConsultationListBoxQueryResponse } from '~relay/ConsultationListBoxQuery.graphql'
import ConsultationListView from './ConsultationListView'
import ConsultationStepHeader from './ConsultationStepHeader'
export type Props = {
  readonly id: RelayGlobalId
}
const CONSULTATION_STEP_QUERY = graphql`
  query ConsultationListBoxQuery($consultationStepId: ID!) {
    step: node(id: $consultationStepId) {
      ... on ConsultationStep {
        ...ConsultationStepHeader_step @arguments(exceptStepId: $consultationStepId)
        consultations {
          ...ConsultationListView_consultations
        }
      }
    }
  }
`

const ConsultationStep = ({
  error,
  props,
}: ReactRelayReadyState & {
  props: ConsultationListBoxQueryResponse | null | undefined
}) => {
  if (error) {
    console.log(error) // eslint-disable-line no-console

    return graphqlError
  }

  if (props) {
    if (props.step && props.step.consultations) {
      return (
        <React.Fragment>
          <ConsultationStepHeader step={props.step} />
          <ConsultationListView consultations={props.step.consultations} />
        </React.Fragment>
      )
    }

    return graphqlError
  }

  return <Loader />
}

export const ConsultationListBox = (props: Props) => {
  const { id: consultationStepId } = props
  return (
    <QueryRenderer
      environment={environment}
      query={CONSULTATION_STEP_QUERY}
      render={ConsultationStep}
      variables={{
        consultationStepId,
      }}
    />
  )
}
export default ConsultationListBox
