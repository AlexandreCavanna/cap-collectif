import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect } from 'react-redux'
import { graphql, createFragmentContainer } from 'react-relay'
import { isInvalid, isSubmitting, isPristine, submit } from 'redux-form'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { formName } from '../Form/EventForm'
import CloseButton from '../../Form/CloseButton'
import SubmitButton from '../../Form/SubmitButton'
import type { State, Dispatch } from '~/types'
import type { EventCreateModal_query } from '~relay/EventCreateModal_query.graphql'
import type { EventCreateModal_event } from '~relay/EventCreateModal_event.graphql'
import colors from '../../../utils/colors'
import { EventFormCreatePage } from '../Form/EventFormPage'

type RelayProps = {
  query: EventCreateModal_query
  event: EventCreateModal_event
}
type Props = RelayProps & {
  show: boolean
  submitting: boolean
  pristine: boolean
  dispatch: Dispatch
  invalid: boolean
  handleClose: () => void
}
export const EventFormInModal: StyledComponent<any, {}, typeof EventFormCreatePage> = styled(EventFormCreatePage)`
  & .box {
    padding: 0;
  }

  .box-title {
    padding-bottom: 5px;
    font-size: 18px;
    border-bottom: 1px solid ${colors.borderColor};
    margin-bottom: 15px;
    color: ${colors.darkText};
  }
`
export const EventCreateModal = ({ submitting, pristine, show, query, event, handleClose, dispatch }: Props) => {
  const intl = useIntl()
  return (
    <Modal animation={false} show={show} onHide={handleClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header
        closeButton
        closeLabel={intl.formatMessage({
          id: 'close.modal',
        })}
      >
        <Modal.Title id="contained-modal-title-lg">
          <FormattedMessage id="event-proposal" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EventFormInModal query={query} event={event} isFrontendView />
      </Modal.Body>
      <Modal.Footer>
        <CloseButton onClose={handleClose} />
        <SubmitButton
          label="global.submit"
          id="confirm-event-submit"
          disabled={pristine || submitting}
          isSubmitting={submitting}
          onSubmit={() => {
            dispatch(submit(formName))
          }}
        />
      </Modal.Footer>
    </Modal>
  )
}

const mapStateToProps = (state: State) => ({
  invalid: isInvalid(formName)(state),
  submitting: isSubmitting(formName)(state),
  pristine: isPristine(formName)(state),
})

export // @ts-ignore
const container = connect<any, any>(mapStateToProps)(EventCreateModal)
export default createFragmentContainer(container, {
  query: graphql`
    fragment EventCreateModal_query on Query @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      ...EventForm_query @include(if: $isAuthenticated)
    }
  `,
  event: graphql`
    fragment EventCreateModal_event on Event {
      ...EventForm_event
    }
  `,
})
