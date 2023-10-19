import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import CloseButton from '../Form/CloseButton'
import SubmitButton from '../Form/SubmitButton'
import { DistrictAdminFieldsConnected } from '../District/DistrictAdminFields'
import { isValid } from '~/services/GeoJsonValidator'
export type District = {
  readonly background:
    | {
        readonly color: string | null | undefined
        readonly enabled: boolean
        readonly opacity: number | null | undefined
      }
    | null
    | undefined
  readonly border:
    | {
        readonly color: string | null | undefined
        readonly enabled: boolean
        readonly opacity: number | null | undefined
        readonly size: number | null | undefined
      }
    | null
    | undefined
  readonly displayedOnMap: boolean
  readonly geojson: string | null | undefined
  readonly id: string
  readonly name: string
}
type Props = {
  show: boolean
  onClose: () => void
  onSubmit: () => void
  member: string
  isCreating: boolean
  district: District | null | undefined
  formName: string
}
type ModalState = {
  valid: boolean
}
declare type InputEvent = {
  target: HTMLInputElement
} & Event
export class ProposalFormAdminDistrictModal extends React.Component<Props, ModalState> {
  constructor(props: Props) {
    super(props)
    this.state = {
      valid: true,
    }
  }

  handleChangeDistrict(event: InputEvent) {
    if ((event.target as HTMLInputElement).value) {
      try {
        const decoded = JSON.parse((event.target as HTMLInputElement).value)
        this.setState({
          valid: isValid(decoded),
        })
      } catch (e) {
        this.setState({
          valid: false,
        })
      }
    } else {
      this.setState({
        valid: true,
      })
    }
  }

  render() {
    const { member, show, isCreating, onClose, onSubmit, district, formName } = this.props
    const { valid } = this.state
    return (
      <Modal show={show} onHide={onClose} aria-labelledby="report-modal-title-lg" bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title id="report-modal-title-lg">
            <FormattedMessage id={!isCreating ? 'district_modal.create.title' : 'add.geographical.area'} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DistrictAdminFieldsConnected
            formName={formName}
            member={member}
            district={district}
            enableDesignFields
            onChange={this.handleChangeDistrict.bind(this)}
          />
        </Modal.Body>
        <Modal.Footer>
          <CloseButton onClose={onClose} />
          <SubmitButton label="global.validate" isSubmitting={false} onSubmit={onSubmit} disabled={!valid} />
        </Modal.Footer>
      </Modal>
    )
  }
}
export default ProposalFormAdminDistrictModal
