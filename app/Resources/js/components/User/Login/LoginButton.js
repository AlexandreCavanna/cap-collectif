// @flow
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import LoginModal from './LoginModal';
import { baseUrl } from '../../../config';
import { showLoginModal } from '../../../redux/modules/user';
import type { Dispatch } from '../../../types';

export const LoginButton = React.createClass({
  propTypes: {
    bsStyle: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      bsStyle: 'default',
      className: '',
      style: {},
    };
  },

  render() {
    const { onClick, style, bsStyle, className } = this.props;
    return (
      <span style={style}>
        <Button bsStyle={bsStyle} onClick={onClick} className={className}>
          {<FormattedMessage id="global.login" />}
        </Button>
        <LoginModal />
      </span>
    );
  },
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClick: () => {
    if (window.location.host.indexOf('paris.fr') > -1) {
      const monCompteBaseUrl = 'https://moncompte.paris.fr/moncompte/';
      const monCompte_backUrlAuth = `${baseUrl}/login-paris?_destination=${window.location.href}`;
      const wH = 600;
      const wW = $(window).innerWidth() < 768 ? $(window).innerWidth() : 800;
      window.open(
        `${monCompteBaseUrl}jsp/site/Portal.jsp?page=myluteceusergu&view=createAccountModal&back_url=${monCompte_backUrlAuth}`,
        '_blank',
        `width=${wW},height=${wH},scrollbars=yes,status=yes,resizable=yes,toolbar=0,menubar=0,location=0,screenx=0,screeny=0`,
      );
    } else {
      dispatch(showLoginModal());
    }
  },
});
const connector = connect(null, mapDispatchToProps);
export default connector(LoginButton);
