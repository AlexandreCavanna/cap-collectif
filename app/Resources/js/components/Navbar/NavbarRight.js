/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { type IntlShape, injectIntl, FormattedMessage } from 'react-intl';
import { Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import RegistrationButton from '../User/Registration/RegistrationButton';
import LoginButton from '../User/Login/LoginButton';
import LoginActions from '../../actions/LoginActions';
import UserAvatar from '../User/UserAvatar';
import type { State } from '../../types';

type Props = {
  intl: IntlShape,
  user?: Object,
  features: Object,
};

export class NavbarRight extends React.Component<Props> {
  static defaultProps = {
    user: null,
  };

  logout = () => {
    // suppress jwt
    LoginActions.logoutUser();
    // We redirect to /logout page to invalidate session on the server
    window.location.href = `${window.location.protocol}//${window.location.host}/logout`;
  };

  render() {
    const { user, features, intl } = this.props;
    return (
      <Nav pullRight>
        {features.search && (
          <NavItem
            eventKey={1}
            className="navbar__search"
            href="/search"
            role="search"
            aria-label={intl.formatMessage({ id: 'search.title' })}>
            <i className="cap cap-magnifier" />{' '}
            <span className="visible-xs-inline" style={{ whiteSpace: 'nowrap' }}>
              <FormattedMessage id="navbar.search" />
            </span>
          </NavItem>
        )}
        {user ? (
          <NavDropdown
            eventKey={3}
            title={
              <span>
                <UserAvatar user={user} size={34} anchor={false} />
                <span className="hidden-xs">{user.username}</span>
              </span>
            }
            className="navbar__dropdown"
            id="navbar-username">
            {user.isAdmin && (
              <MenuItem key={3.1} eventKey={3.1} href="/admin">
                <i className="cap-setting-gears-1" style={{ marginRight: 10 }} />
                <FormattedMessage id="navbar.admin" />
              </MenuItem>
            )}
            {features.profiles && (
              <MenuItem key={3.2} eventKey={3.2} href={`/profile/${user.uniqueId}`}>
                <i className="cap cap-id-8" style={{ marginRight: 10 }} />
                <FormattedMessage id="navbar.profile" />
              </MenuItem>
            )}
            {user.isEvaluer && (
              <MenuItem key={3.3} eventKey={3.3} href="/evaluations">
                <i className="cap cap-edit-write mr-10" />
                <FormattedMessage id="evaluations.index.page_title" />
              </MenuItem>
            )}
            {features.profiles && (
              <React.Fragment>
                <MenuItem key={3.4} eventKey={3.4} href="/profile/edit-profile">
                  <i className="cap cap-setting-adjustment" style={{ marginRight: 10 }} />
                  <FormattedMessage id="navbar.user_settings" />
                </MenuItem>
                <MenuItem key={3.5} divider />
              </React.Fragment>
            )}
            <MenuItem key={3.6} eventKey={3.6} id="logout-button" onClick={this.logout}>
              <i className="cap cap-power-1" style={{ marginRight: 10 }} />
              <FormattedMessage id="global.logout" />
            </MenuItem>
          </NavDropdown>
        ) : (
          <React.Fragment>
            <li>
              <RegistrationButton className="navbar-btn" />{' '}
              <LoginButton className="btn-darkest-gray navbar-btn btn--connection" />
            </li>
          </React.Fragment>
        )}
      </Nav>
    );
  }
}

const mapStateToProps = (state: State) => ({
  features: state.default.features,
  user: state.user.user,
});

const container = injectIntl(NavbarRight);

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(container);
