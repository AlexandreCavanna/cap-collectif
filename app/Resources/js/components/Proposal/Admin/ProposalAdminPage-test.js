/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import ProposalAdminPage from './ProposalAdminPage';

describe('<ProposalAdminPage />', () => {
  const props = {};

  it('render correctly', () => {
    const wrapper = shallow(<ProposalAdminPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
