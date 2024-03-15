/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { ProposalDetailLikersModal } from './ProposalDetailLikersModal'
import { $refType, intlMock } from '../../../mocks'

describe('<ProposalDetailLikersModal />', () => {
  const likersProps = {
    show: true,
    dispatch: jest.fn(),
    intl: intlMock,
    proposal: {
      ' $refType': $refType,
      id: '98069',
      likers: [
        {
          id: '1',
          displayName: 'user 1',
          vip: true,
          userType: {
            name: 'Développeuse web - capco',
          },
          url: 'www.google.com',
          username: 'user1',
          media: {
            url: 'http://monimage.com/image1.jpg',
          },
        },
        {
          id: '2',
          displayName: 'user 2',
          vip: false,
          userType: {
            name: 'Développeur web - capco',
          },
          url: 'www.google.com',
          username: 'user2',
          media: {
            url: 'http://monimage.com/image1.jpg',
          },
        },
      ],
    },
  }
  const likerProps = {
    show: true,
    dispatch: jest.fn(),
    intl: intlMock,
    proposal: {
      ' $refType': $refType,
      id: '89789',
      likers: [
        {
          id: '1',
          displayName: 'user 1',
          vip: true,
          userType: {
            name: 'Développeuse web - capco',
          },
          url: 'www.google.com',
          username: 'user1',
          media: {
            url: 'http://monimage.com/image1.jpg',
          },
        },
      ],
    },
  }
  const props = {
    show: false,
    dispatch: jest.fn(),
    intl: intlMock,
    proposal: {
      ' $refType': $refType,
      id: '79807',
      likers: [],
    },
  }
  it('should render a formatted message when one liker', async () => {
    const wrapper = shallow(<ProposalDetailLikersModal {...likerProps} />)
    await expect(wrapper).toMatchSnapshot()
  })
  it('should render a formatted message when several liker', async () => {
    const wrapper = shallow(<ProposalDetailLikersModal {...likersProps} />)
    await expect(wrapper).toMatchSnapshot()
  })
  it('should render nothing when no likers', async () => {
    const wrapper = shallow(<ProposalDetailLikersModal {...props} />)
    await expect(wrapper.children()).toHaveLength(0)
    await expect(wrapper).toMatchSnapshot()
  })
})
