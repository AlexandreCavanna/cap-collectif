/* @flow */
import React, { PropTypes } from 'react';
import { connect, type MapStateToProps } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import RegistrationButton from '../User/Registration/RegistrationButton';
import LoginButton from '../User/Login/LoginButton';
import LoginActions from '../../actions/LoginActions';
import UserAvatar from '../User/UserAvatar';
import type { State } from '../../types';

export const NavbarRight = React.createClass({
  propTypes: {
    user: PropTypes.object,
    features: PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      user: null,
    };
  },

  logout() {
    // suppress jwt
    LoginActions.logoutUser();
    // We redirect to /logout page to invalidate session on the server
    window.location.href = `${window.location.protocol}//${window.location.host}/logout`;
  },

  render() {
    const { user, features } = this.props;
    return (
      <Nav pullRight>
        {features.search && (
          <NavItem eventKey={1} className="navbar__search" href="/search">
            <i className="cap cap-magnifier" />{' '}
            <span className="visible-xs-inline" style={{ whiteSpace: 'nowrap' }}>
              {<FormattedMessage id="navbar.search" />}
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
                {<FormattedMessage id="navbar.admin" />}
              </MenuItem>
            )}
            {features.profiles && (
              <MenuItem key={3.2} eventKey={3.2} href={`/profile/${user.uniqueId}`}>
                {<FormattedMessage id="navbar.profile" />}
              </MenuItem>
            )}
            {user.isEvaluer && (
              <MenuItem key={3.3} eventKey={3.3} href="/evaluations">
                <FormattedMessage id="evaluations.index.page_title" />
              </MenuItem>
            )}
            <MenuItem
              key={3.4}
              eventKey={3.4}
              href={`/profile/${features.profiles ? 'edit-profile' : 'edit-account'}`}>
              {<FormattedMessage id="navbar.user_settings" />}
            </MenuItem>
            <MenuItem key={3.5} divider />
            <MenuItem key={3.6} eventKey={3.6} id="logout-button" onClick={this.logout}>
              {<FormattedMessage id="global.logout" />}
            </MenuItem>
          </NavDropdown>
        ) : (
          <li>
            <RegistrationButton className="navbar-btn" />{' '}
            <LoginButton className="btn-darkest-gray navbar-btn btn--connection" />
          </li>
        )}
      </Nav>
    );
  },
});

const mapStateToProps: MapStateToProps<*, *, *> = (state: State) => {
  return {
    features: state.default.features,
    user: state.user.user,
  };
};

export default connect(mapStateToProps, null, null, { withRef: true })(NavbarRight);
