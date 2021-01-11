// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { ParameterPage } from './index';
import { $refType, $fragmentRefs } from '~/mocks';

const baseProps = {
  disabled: false,
  showError: false,
  emailingCampaign: {
    $refType,
    mailingList: {
      $fragmentRefs,
      name: 'Je suis une mailingList',
      project: {
        title: 'P&C',
      },
      users: {
        totalCount: 3,
      },
    },
    mailingInternal: null,
  },
  query: {
    $refType,
    mailingLists: {
      totalCount: 2,
      edges: [
        {
          node: {
            id: '1',
            name: 'Je suis une mailingList',
          },
        },
        {
          node: {
            id: '2',
            name: 'Je suis une mailingList aussi',
          },
        },
      ],
    },
  },
};

const props = {
  basic: baseProps,
  disabled: {
    ...baseProps,
    disabled: true,
  },
  withError: {
    ...baseProps,
    showError: true,
  },
  withMailingListInternal: {
    ...baseProps,
    emailingCampaign: {
      ...baseProps.emailingCampaign,
      mailingInternal: 'CONFIRMED',
    },
  },
};

describe('<ParameterPage />', () => {
  it('should renders correctly', () => {
    const wrapper = shallow(<ParameterPage {...props.basic} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should renders correctly when disabled', () => {
    const wrapper = shallow(<ParameterPage {...props.disabled} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should renders correctly when error', () => {
    const wrapper = shallow(<ParameterPage {...props.withError} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should renders correctly when mailing list internal selected', () => {
    const wrapper = shallow(<ParameterPage {...props.withMailingListInternal} />);
    expect(wrapper).toMatchSnapshot();
  });
});