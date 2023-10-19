// @ts-nocheck
/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import EventFormPageApp from './EventFormPageApp'

describe('<EventFormPageApp />', () => {
  const defaultProps = {
    eventId: 'eventGlobalId1',
    isAuthenticated: false,
    isAdmin: true,
  }
  it('should render correctly with defaultProps', () => {
    const wrapper = shallow(<EventFormPageApp {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
