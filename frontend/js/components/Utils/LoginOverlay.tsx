import * as React from 'react'
import { useIntl } from 'react-intl'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { usePopoverState, Popover, PopoverDisclosure, PopoverArrow } from 'reakit/Popover'
import { connect } from 'react-redux'
import { useAnalytics } from 'use-analytics'
import { showRegistrationModal } from '~/redux/modules/user'
import type { Dispatch, State } from '~/types'
import Button from '~ds/Button/Button'
import LoginButton from '../User/Login/LoginButton'
import { loginWithOpenID } from '~/redux/modules/default'
import AppBox from '~ui/Primitives/AppBox'
import Text from '~ui/Primitives/Text'
import Flex from '~ui/Primitives/Layout/Flex'
import VisuallyHidden from '~ds/VisuallyHidden/VisuallyHidden'
export type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start'
type OwnProps = {
  readonly children: any
  readonly enabled?: boolean
  readonly placement?: Placement
}
type StateProps = {
  readonly isAuthenticated: boolean
  readonly showRegistrationButton: boolean
  readonly loginWithOpenId?: boolean
}
type Props = OwnProps &
  StateProps & {
    readonly dispatch: Dispatch
  }
const PopoverContainer: StyledComponent<any, {}, HTMLDivElement> = styled(AppBox).attrs({
  maxWidth: '280px',
  zIndex: 100,
})`
  outline: none;
`
const ButtonRegistration: StyledComponent<any, {}, HTMLButtonElement> = styled.button`
  margin: 10px 0 0 0;
`
const Arrow = styled(AppBox)<{
  position: Placement
}>`
  .stroke {
    fill: none;
  }

  .fill {
    fill: ${props => (props.position === 'bottom' ? '#f7f7f7' : 'white')};
  }
`
// There is !important css because there is specific styles on pages that break the component display
export const LoginOverlay = ({
  isAuthenticated,
  children,
  enabled = true,
  showRegistrationButton,
  loginWithOpenId = false,
  placement = 'auto',
  dispatch,
}: Props) => {
  const { track } = useAnalytics()
  const popover = usePopoverState({
    baseId: 'popover-overlay',
    placement,
  })
  const intl = useIntl()
  if (!enabled || isAuthenticated) return children
  return (
    <>
      <PopoverDisclosure {...popover} ref={children.ref} {...children.props} onClick={null}>
        {disclosureProps => React.cloneElement(children, disclosureProps)}
      </PopoverDisclosure>

      <Popover
        {...popover}
        tabIndex={0}
        aria-label={intl.formatMessage({
          id: 'vote.popover.title',
        })}
        as={PopoverContainer}
        id="login-popover"
        borderRadius="popover"
        boxShadow="0 5px 10px rgb(0 0 0 / 20%)"
      >
        <PopoverArrow {...popover} as={Arrow} position={popover.placement} />

        <AppBox overflow="hidden" borderRadius="popover" bg="white" color="black">
          <Text
            py="8px !important"
            px={3}
            bg="#f7f7f7"
            borderBottom="normal"
            borderColor="#ebebeb"
            fontSize={3}
            mb="0 !important"
            textAlign="left !important"
          >
            {intl.formatMessage({
              id: 'vote.popover.title',
            })}
          </Text>

          <Flex px={3} py="10px" direction="column" spacing="10px">
            <Text fontSize={3} pb="0 !important" textAlign="left !important" mb="0 !important">
              {intl.formatMessage({
                id: 'vote.popover.body',
              })}
            </Text>

            <VisuallyHidden>
              <Button onClick={popover.hide}>
                {intl.formatMessage({
                  id: 'global.close',
                })}
              </Button>
            </VisuallyHidden>

            {showRegistrationButton && !loginWithOpenId && (
              <ButtonRegistration
                type="button"
                onClick={() => {
                  track('overlay_registration_click')
                  dispatch(showRegistrationModal())
                }}
                className="center-block btn-block btn btn-default"
              >
                {intl.formatMessage({
                  id: 'global.registration',
                })}
              </ButtonRegistration>
            )}
            <LoginButton bsStyle="success" className="center-block btn-block login-button" />
          </Flex>
        </AppBox>
      </Popover>
    </>
  )
}
LoginOverlay.displayName = 'LoginOverlay'

const mapStateToProps = (state: State) => ({
  isAuthenticated: !!state.user.user,
  showRegistrationButton: state.default.features.registration || false,
  loginWithOpenId: loginWithOpenID(state.default.ssoList),
})

// @ts-ignore
export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps)(LoginOverlay)
