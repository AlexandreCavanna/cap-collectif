import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import type { StyledComponent } from 'styled-components'
import styled, { css } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import ShareButtonDropdownLegacy from '../Utils/ShareButtonDropdownLegacy'
import { breakpoint } from '../../utils/mixins'
import type { MetaStepNavigation_step } from '~relay/MetaStepNavigation_step.graphql'
import AppBox from '~ui/Primitives/AppBox'
type RelayProps = {
  readonly step: MetaStepNavigation_step
}
type Props = RelayProps
const SHARE_BUTTON_ID = 'share-button'
const BACK_TO_LIST_BUTTON_ID = 'back-to-list-button'
const BackIcon = styled.i.attrs({
  className: 'cap-arrow-65 position-relative',
})`
  top: 2px;
`
const BackMessage: StyledComponent<any, {}, HTMLSpanElement> = styled.span`
  display: none;
  ${breakpoint(
    'medium',
    css`
      display: inline;
    `,
  )}
`
// The consultation span selector is a bit hacky but I have no way to control the ShareButtonDropdownLegacy
// component without redo some writing of the component to allow handle responsive cases
const ShareButtonDropdownLegacyInner: StyledComponent<any, {}, HTMLSpanElement> = styled.span`
  #${SHARE_BUTTON_ID} > span > span:last-child {
    display: none;
    ${breakpoint(
      'medium',
      css`
        display: inline;
      `,
    )}
  }
`
export const MetaStepNavigationBackButton = ({ step }: { step: MetaStepNavigation_step }) => {
  switch (step.__typename) {
    case 'ConsultationStep':
      return (
        <div>
          <Button id={BACK_TO_LIST_BUTTON_ID} href={step.url}>
            <BackIcon />
            &nbsp;
            <BackMessage>
              <FormattedMessage id="consultations-list" />
            </BackMessage>
          </Button>
        </div>
      )

    default:
      return null
  }
}
export const MetaStepNavigationTitle = ({ step }: { step: MetaStepNavigation_step }) => {
  switch (step.__typename) {
    case 'ConsultationStep':
      return (
        <h2>
          <FormattedMessage id="global.consultation" />
        </h2>
      )

    default:
      return null
  }
}
export const MetaStepNavigationShare = ({ step }: { step: MetaStepNavigation_step }) => {
  switch (step.__typename) {
    case 'ConsultationStep':
      return step.consultation ? (
        <AppBox textAlign="right">
          <ShareButtonDropdownLegacyInner>
            <ShareButtonDropdownLegacy
              id={SHARE_BUTTON_ID}
              url={step.consultation.url}
              title={step.consultation.title}
            />
          </ShareButtonDropdownLegacyInner>
        </AppBox>
      ) : null

    default:
      return null
  }
}
export const MetaStepNavigation = ({ step }: Props) => {
  return (
    <React.Fragment>
      <MetaStepNavigationBackButton step={step} />
      <MetaStepNavigationTitle step={step} />
      <MetaStepNavigationShare step={step} />
    </React.Fragment>
  )
}
export default createFragmentContainer(MetaStepNavigation, {
  step: graphql`
    fragment MetaStepNavigation_step on Step @argumentDefinitions(relatedSlug: { type: "String!" }) {
      __typename
      url
      ... on ConsultationStep {
        consultation(slug: $relatedSlug) {
          url
          title
        }
      }
    }
  `,
})
