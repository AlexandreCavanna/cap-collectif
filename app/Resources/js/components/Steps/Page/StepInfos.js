import React from 'react';
import CountersNav from './CountersNav';
import StepText from './StepText';
import { IntlMixin } from 'react-intl';

const StepInfos = React.createClass({
  displayName: 'StepInfos',
  propTypes: {
    step: React.PropTypes.object.isRequired,
  },
  mixins: [IntlMixin],

  render() {
    const { step } = this.props;
    const counters = step.counters;
    const body = step.body;
    if (!body) {
      return null;
    }
    return (
      <div className="step__infos block block--bordered">
        <CountersNav counters={counters} bordered={!!body} />
        <StepText text={body} />
      </div>
    );
  },

});

export default StepInfos;
