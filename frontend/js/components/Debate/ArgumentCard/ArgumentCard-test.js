// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { ArgumentCard } from './ArgumentCard';
import { $refType, $fragmentRefs } from '~/mocks';

const defaultProps = {
  argument: {
    $refType,
    $fragmentRefs,
    id: 'argumentPour42',
    body: 'Je suis pour le LSD dans nos cantines',
    votes: {
      totalCount: 500,
    },
    author: {
      id: 'AguiLeBg',
      username: 'Agui',
    },
    type: 'FOR',
    publishedAt: '01-02-2021:19h00',
    viewerHasVote: true,
    viewerDidAuthor: true,
  },
  setReportModalId: jest.fn(),
  setModerateModalId: jest.fn(),
  setDeleteModalInfo: jest.fn(),
  isMobile: false,
  viewer: null,
};

const props = {
  basic: defaultProps,
  isMobile: {
    ...defaultProps,
    isMobile: true,
  },
  asViewer: {
    ...defaultProps,
    viewer: {
      ...defaultProps.viewer,
      $refType,
      isAdmin: false,
    },
  },
  asViewerAdmin: {
    ...defaultProps,
    viewer: {
      ...defaultProps.viewer,
      $refType,
      isAdmin: true,
    },
  },
};

describe('<ArgumentCard />', () => {
  it('renders correcty', () => {
    const wrapper = shallow(<ArgumentCard {...props.basic} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correcty on mobile', () => {
    const wrapper = shallow(<ArgumentCard {...props.isMobile} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correcty when connected as viewer', () => {
    const wrapper = shallow(<ArgumentCard {...props.asViewer} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correcty when connected as admin', () => {
    const wrapper = shallow(<ArgumentCard {...props.asViewerAdmin} />);
    expect(wrapper).toMatchSnapshot();
  });
});