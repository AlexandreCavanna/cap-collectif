/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { ArgumentCard } from './ArgumentCard'
import { $refType, $fragmentRefs } from '~/mocks'

const defaultProps = {
  argument: {
    ' $refType': $refType,
    ' $fragmentRefs': $fragmentRefs,
    id: 'argumentPour42',
    body: 'Je suis pour le LSD dans nos cantines',
    votes: {
      totalCount: 500,
    },
    author: {
      id: 'AguiLeBg',
      username: 'Agui',
    },
    debate: {
      id: 'debate-123',
      url: '/debate123',
    },
    type: 'FOR',
    viewerHasVote: false,
    viewerDidAuthor: false,
    viewerCanReport: false,
    published: true,
  },
  setArgumentReported: jest.fn(),
  setModerateArgumentModal: jest.fn(),
  setDeleteModalInfo: jest.fn(),
  isMobile: false,
  viewer: null,
}
const props = {
  basic: defaultProps,
  isMobile: { ...defaultProps, isMobile: true },
  asViewer: {
    ...defaultProps,
    argument: { ...defaultProps.argument, viewerHasVote: true, viewerCanReport: true, viewerDidAuthor: true },
    viewer: { ...defaultProps.viewer, $refType, isAdmin: false, isEmailConfirmed: true },
  },
  asViewerNotConfirmed: {
    ...defaultProps,
    viewer: { ...defaultProps.viewer, $refType, isAdmin: false, isEmailConfirmed: false },
  },
  asViewerAdmin: {
    ...defaultProps,
    argument: { ...defaultProps.argument, viewerCanReport: false, viewerHasVote: true, viewerDidAuthor: true },
    viewer: { ...defaultProps.viewer, $refType, isAdmin: true, isEmailConfirmed: true },
  },
}
describe('<ArgumentCard />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ArgumentCard {...props.basic} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly on mobile', () => {
    const wrapper = shallow(<ArgumentCard {...props.isMobile} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly when connected as viewer', () => {
    const wrapper = shallow(<ArgumentCard {...props.asViewer} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly when connected as viewer not confirmed', () => {
    const wrapper = shallow(<ArgumentCard {...props.asViewerNotConfirmed} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly when connected as admin', () => {
    const wrapper = shallow(<ArgumentCard {...props.asViewerAdmin} />)
    expect(wrapper).toMatchSnapshot()
  })
})
