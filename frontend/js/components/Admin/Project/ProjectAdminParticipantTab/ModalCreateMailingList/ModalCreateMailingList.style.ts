import styled from 'styled-components'
import { Modal } from 'react-bootstrap'
import colors from '~/utils/colors'
import { MAIN_BORDER_RADIUS } from '~/utils/styles/variables'

export const Container = styled(Modal)`
  .modal-title {
    font-weight: 600;
  }

  .modal-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &:before,
    &:after {
      content: none;
    }
  }
`
export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  p {
    margin: 0;
  }

  .count-members {
    margin-right: 5px;
  }

  .project-title {
    margin-left: 5px;
  }
`
export const ButtonSave = styled.button`
  border: none;
  background-color: ${colors.darkGray};
  color: #fff;
  padding: 6px 12px;
  ${MAIN_BORDER_RADIUS};

  &:disabled {
    opacity: 0.5;
  }
`
