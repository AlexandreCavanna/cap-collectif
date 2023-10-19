import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Modal } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect } from 'react-redux'
import { isInvalid, submit, isSubmitting, getFormSyncErrors } from 'redux-form'
import OpinionCreateForm, { formName } from '../Form/OpinionCreateForm'
import CloseButton from '../../Form/CloseButton'
import SubmitButton from '../../Form/SubmitButton'
import { closeOpinionCreateModal } from '../../../redux/modules/opinion'
import type { State, Dispatch } from '../../../types'
import type { OpinionCreateModal_section } from '~relay/OpinionCreateModal_section.graphql'
import type { OpinionCreateModal_consultation } from '~relay/OpinionCreateModal_consultation.graphql'
import { formName as requirementsFormName } from '../../Requirements/RequirementsFormLegacy'
type RelayProps = {
  section: OpinionCreateModal_section
  consultation: OpinionCreateModal_consultation
}
type Props = RelayProps & {
  readonly show: boolean
  readonly submitting: boolean
  readonly dispatch: Dispatch
  readonly invalidRequirements: boolean
}
export const OpinionCreateModal = ({
  section,
  consultation,
  submitting,
  dispatch,
  show,
  invalidRequirements,
}: Props) => {
  const intl = useIntl()
  return (
    <Modal
      animation={false}
      show={show}
      onHide={() => {
        if (
          window.confirm(
            intl.formatMessage({
              id: 'proposal.confirm_close_modal',
            }),
          )
        ) {
          dispatch(closeOpinionCreateModal())
        }
      }}
      bsSize="large"
      aria-labelledby="contained-modal-title-lg"
    >
      <Modal.Header
        closeButton
        closeLabel={intl.formatMessage({
          id: 'close.modal',
        })}
      >
        <Modal.Title id="contained-modal-title-lg">
          <FormattedMessage id="opinion.add_new" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-top bg-info">
          <p>
            <FormattedMessage id="opinion.add_new_infos" />
          </p>
        </div>
        {consultation && (
          <OpinionCreateForm section={section} consultationStep={consultation.step} consultation={consultation} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <CloseButton
          onClose={() => {
            dispatch(closeOpinionCreateModal())
          }}
        />
        <SubmitButton
          label="global.create"
          id="confirm-opinion-create"
          disabled={invalidRequirements}
          isSubmitting={submitting}
          onSubmit={() => {
            dispatch(submit(formName))
          }}
        />
      </Modal.Footer>
    </Modal>
  )
}

const mapStateToProps = (state: State, props: RelayProps) => ({
  show: state.opinion.showOpinionCreateModal === props.section.id,
  submitting: isSubmitting(formName)(state),
  invalidRequirements:
    isInvalid(requirementsFormName)(state) || Object.keys(getFormSyncErrors(requirementsFormName)(state)).length > 0,
})

// @ts-ignore
const container = connect<any, any>(mapStateToProps)(OpinionCreateModal)
export default createFragmentContainer(container, {
  section: graphql`
    fragment OpinionCreateModal_section on Section {
      id
      ...OpinionCreateForm_section
    }
  `,
  consultation: graphql`
    fragment OpinionCreateModal_consultation on Consultation
    @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      ...OpinionCreateForm_consultation
      step {
        ...OpinionCreateForm_consultationStep @arguments(isAuthenticated: $isAuthenticated)
      }
    }
  `,
})
