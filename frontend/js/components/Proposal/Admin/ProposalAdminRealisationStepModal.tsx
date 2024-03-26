import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import CloseButton from '../../Form/CloseButton'
import SubmitButton from '../../Form/SubmitButton'
import component from '../../Form/Field'

type Props = {
  show: boolean
  onClose: (arg0: boolean) => void
  member: string
  isCreating: boolean
}
export class ProposalAdminRealisationStepModal extends React.Component<Props> {
  render() {
    const { member, show, isCreating, onClose } = this.props
    return (
      <Modal
        id="realisation-step-modal"
        show={show}
        onHide={() => onClose(false)}
        aria-labelledby="report-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="report-modal-title-lg">
            <FormattedMessage
              id={isCreating ? 'realisation_step_modal.create.title' : 'realisation_step_modal.update.title'}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field
            label={<FormattedMessage id="global.title" />}
            id={`${member}.title`}
            name={`${member}.title`}
            type="text"
            component={component}
          />
          <Field
            timeFormat={false}
            label={<FormattedMessage id="start-date" />}
            id={`${member}.startAt`}
            name={`${member}.startAt`}
            type="datetime"
            component={component}
          />
          <Field
            timeFormat={false}
            label={
              <span>
                <FormattedMessage id="global.endDate" />{' '}
                <span className="excerpt">
                  <FormattedMessage id="global.optional" />
                </span>
              </span>
            }
            id={`${member}.endAt`}
            name={`${member}.endAt`}
            type="datetime"
            component={component}
          />
        </Modal.Body>
        <Modal.Footer>
          <CloseButton onClose={() => onClose(false)} />
          <SubmitButton
            id="ProposalAdminRealisationStepModal-submit"
            label="global.validate"
            isSubmitting={false}
            onSubmit={() => onClose(true)}
          />
        </Modal.Footer>
      </Modal>
    )
  }
}
export default connect()(ProposalAdminRealisationStepModal)
