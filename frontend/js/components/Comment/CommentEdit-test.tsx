/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { CommentEdit } from './CommentEdit'
import { $refType } from '../../mocks'

const defaultComment = {
  id: '<mock-comment-id/>',
  ' $refType': $refType,
  editUrl: 'https://aa.com/',
  contribuable: true,
  moderationStatus: 'APPROVED',
  author: {
    isViewer: true,
    isAdmin: false,
  },
}
const defaultProps = {
  comment: defaultComment,
}
describe('<CommentEdit />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<CommentEdit {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render null with contribuable false', () => {
    const props = {
      comment: { ...defaultComment, contribuable: false },
    }
    const wrapper = shallow(<CommentEdit {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render null with author isViewer false', () => {
    const props = {
      comment: {
        ...defaultComment,
        author: {
          isViewer: false,
          isAdmin: false,
        },
      },
    }
    const wrapper = shallow(<CommentEdit {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
