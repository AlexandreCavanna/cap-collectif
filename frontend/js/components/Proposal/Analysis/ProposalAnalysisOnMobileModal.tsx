import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import styled from 'styled-components'
import CloseButton from '~/components/Form/CloseButton'
import colors from '~/utils/colors'

type Props = {
  show: boolean
  onClose: () => void
}
const Body = styled.div`
  font-size: 15px;
  color: ${colors.darkGray};
`
export const ProposalAnalysisOnMobileModal = ({ show, onClose }: Props) => (
  <Modal show={show} onHide={onClose} aria-labelledby="proposal-analysis-modal-mobile">
    <Modal.Header closeButton>
      <Modal.Title id="proposal-analysis-modal-mobile">
        <FormattedMessage id="analyzing.proposal" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Body>
        <FormattedMessage id="mobile.analysis.unavailable" />
      </Body>
    </Modal.Body>
    <Modal.Footer>
      <CloseButton onClose={onClose} label="global.close" />
    </Modal.Footer>
  </Modal>
)
export default ProposalAnalysisOnMobileModal
