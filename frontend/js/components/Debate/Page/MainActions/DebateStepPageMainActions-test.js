// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { DebateStepPageMainActions } from './DebateStepPageMainActions';
import { $refType, $fragmentRefs } from '~/mocks';

const defaultProps = {
  title: 'Pour ou contre le LSD dans nos cantines',
  step: {
    $refType,
    timeRange: { endAt: '2021-18-02:00:00' },
    timeless: false,
    debate: { $fragmentRefs },
    url: '/debatestep1',
  },
  isAuthenticated: true,
  isMobile: false,
};

const props = {
  basic: defaultProps,
  isMobile: {
    ...defaultProps,
    isMobile: true,
  },
  whenTimeless: {
    ...defaultProps,
    step: {
      ...defaultProps.step,
      timeless: true,
      timeRange: { endAt: null },
    },
  },
};

describe('<DebateStepPageMainActions/>', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DebateStepPageMainActions {...props.basic} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly on mobile', () => {
    const wrapper = shallow(<DebateStepPageMainActions {...props.isMobile} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when step is timeless', () => {
    const wrapper = shallow(<DebateStepPageMainActions {...props.whenTimeless} />);
    expect(wrapper).toMatchSnapshot();
  });
});