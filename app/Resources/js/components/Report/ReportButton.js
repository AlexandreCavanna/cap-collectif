import React, { PropTypes } from 'react';
import LoginOverlay from '../Utils/LoginOverlay';
import { Button } from 'react-bootstrap';
import { IntlMixin } from 'react-intl';
import classNames from 'classnames';
import { connect } from 'react-redux';

const ReportButton = React.createClass({
  propTypes: {
    id: PropTypes.string,
    reported: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    bsSize: PropTypes.string,
    user: PropTypes.object,
    features: PropTypes.object.isRequired,
  },
  mixins: [IntlMixin],

  getDefaultProps() {
    return {
      id: 'report-button',
      className: '',
      style: {},
      bsSize: null,
      user: null,
    };
  },

  render() {
    const { reported, className, onClick, bsSize, user, features, id, style } = this.props;
    const classes = {
      'btn--outline': true,
      'btn-dark-gray': true,
    };
    classes[className] = true;
    return (
      <LoginOverlay user={user} features={features}>
        <Button
          id={id}
          style={style}
          bsSize={bsSize}
          className={classNames(classes)}
          onClick={reported ? null : onClick}
          active={reported}
        >
          <i className="cap cap-flag-1"></i>
          { ' ' }
          {
            reported
              ? this.getIntlMessage('global.report.reported')
              : this.getIntlMessage('global.report.submit')
          }
        </Button>
      </LoginOverlay>
    );
  },

});

const mapStateToProps = (state) => {
  return {
    features: state.default.features,
    user: state.default.user,
  };
};

export default connect(mapStateToProps)(ReportButton);
