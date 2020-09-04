// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { ProjectAdminSelectionStepForm } from './ProjectAdminSelectionStepForm';

describe('<ProjectAdminSelectionStepForm />', () => {
  const defaultProps = {
    dispatch: jest.fn(),
    isBudgetEnabled: false,
    isTresholdEnabled: false,
    isLimitEnabled: false,
    votable: false,
  };

  it('renders correctly with no initial data', () => {
    const wrapper = shallow(<ProjectAdminSelectionStepForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with data', () => {
    const props = {
      dispatch: jest.fn(),
      isBudgetEnabled: true,
      isTresholdEnabled: true,
      isLimitEnabled: true,
      votable: true,
      requirements: [
        { type: 'CHECKBOX', checked: false, label: 'Sku' },
        {
          id: 'fumier',
          type: 'LASTNAME',
        },
      ],
    };
    const wrapper = shallow(<ProjectAdminSelectionStepForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});