/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { OpinionRow } from './OpinionRow'
import { $refType } from '../../../mocks'

describe('<OpinionRow />', () => {
  const opinion = {
    ' $refType': $refType,
    url: 'http://perdu.com',
    id: 'opinion1',
    title: 'perdu sur internet ?',
  }
  it('should render opinion displayed', () => {
    const wrapper = shallow(<OpinionRow opinion={opinion} />)
    wrapper.setState({
      open: true,
    })
    expect(wrapper).toMatchSnapshot()
  })
  it('should render opinion hidden', () => {
    const wrapper = shallow(<OpinionRow opinion={opinion} />)
    wrapper.setState({
      open: false,
    })
    expect(wrapper).toMatchSnapshot()
  })
})
