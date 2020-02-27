/* @flow */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { type IntlShape, injectIntl, FormattedMessage } from 'react-intl';

import TabsBarDropdown from '../Ui/TabsBar/TabsBarDropdown';
import { TabsItemContainer, TabsLink, TabsDivider } from '../Ui/TabsBar/styles';
import RegistrationButton from '../User/Registration/RegistrationButton';
import LoginButton from '../User/Login/LoginButton';
import UserAvatarDeprecated from '../User/UserAvatarDeprecated';
import type { State, FeatureToggles } from '../../types';
import type { User } from '../../redux/modules/user';
import { loginWithOpenID } from '~/redux/modules/default';

const ButtonsContainer = styled.div`
  padding: ${props => (props.vertical ? '10px 15px' : '0 15px')};
`;

type Props = {|
  currentLanguage: string,
  intl: IntlShape,
  user?: ?User,
  features: FeatureToggles,
  vertical: boolean,
  eventKey?: number | string,
  ariaLabel?: string,
  loginWithOpenId: boolean,
|};

export class NavbarRight extends React.Component<Props> {
  static defaultProps = {
    user: null,
    vertical: false,
  };

  logout = () => {
    // We redirect to /logout page to invalidate session on the server
    window.location.href = `${window.location.protocol}//${window.location.host}/logout`;
  };

  render() {
    const { user, features, vertical, intl, loginWithOpenId, currentLanguage } = this.props;

    const prefix = (features.unstable__multilangue) ? `/${currentLanguage.split('-')[0]}` : '';

    return (
      <>
        {features.search && (
          <TabsItemContainer
            vertical={vertical}
            as="div"
            role="search"
            aria-label={intl.formatMessage({ id: 'search.title' })}>
            <TabsLink id="global.menu.search" eventKey={1} href="/search">
              <i className="cap cap-magnifier" />{' '}
              <span className="visible-xs-inline ml-5">
                <FormattedMessage id="global.menu.search" />
              </span>
            </TabsLink>
          </TabsItemContainer>
        )}
        {user ? (
          <TabsBarDropdown
            pullRight
            intl={intl}
            eventKey={3}
            vertical={vertical}
            id="navbar-username"
            aria-label={intl.formatMessage(
              { id: 'user.account.menu' },
              { username: user.username },
            )}
            toggleElement={
              <span>
                <UserAvatarDeprecated user={user} size={34} anchor={false} />
                <span className="ml-5">{user.username}</span>
              </span>
            }>
            {user.isAdmin ? (
              <TabsLink eventKey={3.1} href="/admin/">
                <i className="cap-setting-gears-1 mr-10" aria-hidden="true" />
                <FormattedMessage id="global.administration" />
              </TabsLink>
            ) : null}
            {features.profiles && !loginWithOpenId ? (
              <TabsLink eventKey={3.2} href={`${prefix}/profile/${user.uniqueId}`}>
                <i className="cap cap-id-8 mr-10" aria-hidden="true" />
                <FormattedMessage id="user.my.profile" />
              </TabsLink>
            ) : null}
            {!features.profiles && loginWithOpenId ? (
              <TabsLink
                eventKey={3.3}
                href={`/sso/profile?referrer=${window.location.href}`}
                target="_blank"
                rel="noopener">
                <i className="cap cap-id-8 mr-10" aria-hidden="true" />
                <FormattedMessage id="user.my.profile" />
                <i className="cap cap-external-link ml-10" aria-hidden="true" />
              </TabsLink>
            ) : null}
            {user.isEvaluer ? (
              <TabsLink eventKey={3.4} href="/evaluations">
                <i className="cap cap-edit-write mr-10" aria-hidden="true" />
                <FormattedMessage id="evaluations.index.page_title" />
              </TabsLink>
            ) : null}
            <TabsLink eventKey={3.5} href={`${prefix}/profile/edit-profile`}>
              <i className="cap cap-setting-adjustment mr-10" aria-hidden="true" />
              <FormattedMessage id="global.params" />
            </TabsLink>
            {features.disconnect_openid ? (
              <TabsLink eventKey={3.6} href="/logout?ssoSwitchUser=true">
                <i className="cap cap-refresh mr-10" aria-hidden="true" />
                <FormattedMessage id="change-user" />
              </TabsLink>
            ) : null}
            <TabsDivider aria-hidden="true" />
            <TabsLink type="button" eventKey={3.7} id="logout-button" onClick={this.logout}>
              <i className="cap cap-power-1 mr-10" aria-hidden="true" />
              <FormattedMessage id="global.logout" />
            </TabsLink>
          </TabsBarDropdown>
        ) : (
          <ButtonsContainer vertical={vertical}>
            <RegistrationButton className="navbar-btn" />{' '}
            <LoginButton className="btn-darkest-gray navbar-btn btn--connection" />
          </ButtonsContainer>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: State) => ({
  features: state.default.features,
  loginWithOpenId: loginWithOpenID(state.default.ssoList),
  user: state.user.user,
});

const container = injectIntl(NavbarRight, { forwardRef: true });

export default connect(mapStateToProps, null, null, { withRef: true })(container);
