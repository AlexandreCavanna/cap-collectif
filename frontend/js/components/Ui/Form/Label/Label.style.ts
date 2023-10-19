import { $Values } from 'utility-types'
import styled from 'styled-components'
import { TYPE_FORM } from '~/constants/FormConstants'
import isQuestionnaire from '~/utils/isQuestionnaire'

const LabelContainer = styled.label.attrs({
  className: 'label-container',
})<{
  type?: string
  hasImage: boolean
  typeForm: $Values<typeof TYPE_FORM>
}>`
  font-weight: normal;
  margin: 0;
  font-size: ${({ typeForm }) => (isQuestionnaire(typeForm) ? '16px' : '14px')};
  cursor: ${({ type }) => type !== 'label' && 'pointer'};
  margin-bottom: 4px !important; /* override conflicting sonata global css rules which have a greater css selector weight, so !important is relevant here */

  & > .icon {
    flex-shrink: 0; /* allow space for width & height */
    margin-right: ${({ type, hasImage }) => (type && !hasImage ? '10px' : '0')};
  }

  & .excerpt.inline {
    margin-left: 5px;
  }
`
export default LabelContainer
