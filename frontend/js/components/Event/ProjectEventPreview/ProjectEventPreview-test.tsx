/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { ProjectEventPreview } from './ProjectEventPreview'
import { $refType, $fragmentRefs } from '~/mocks'

const baseEvent = {
  ' $refType': $refType,
  id: 'eventId',
  title: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
  url: '#',
  author: null,
  guestListEnabled: false,
  timeRange: {
    startAt: '2030-03-10 00:00:00',
    endAt: '2030-03-11 00:00:00',
  },
  googleMapsAddress: {
    __typename: 'GoogleMapsAddress',
    ' $fragmentRefs': $fragmentRefs,
  },
}
const event = {
  basic: baseEvent,
  withoutAddress: { ...baseEvent, googleMapsAddress: null },
  withoutDate: {
    ...baseEvent,
    timeRange: {
      startAt: null,
      endAt: null,
    },
  },
  withGuestEnabled: { ...baseEvent, guestListEnabled: true },
  passedEvent: {
    ...baseEvent,
    timeRange: {
      startAt: '2021-03-10 00:00:00',
      endAt: '2022-03-11 00:00:00',
    },
  },
  notPassedEvent: {
    ...baseEvent,
    timeRange: {
      startAt: '2020-03-10 00:00:00',
      endAt: '2030-03-11 00:00:00',
    },
  },
}
describe('<ProjectEventPreview />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ProjectEventPreview event={event.basic} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly when no googleMapsAddress', () => {
    const wrapper = shallow(<ProjectEventPreview event={event.withoutAddress} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly when no date', () => {
    const wrapper = shallow(<ProjectEventPreview event={event.withoutDate} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly when guest enabled', () => {
    const wrapper = shallow(<ProjectEventPreview event={event.withGuestEnabled} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly no passed event', () => {
    const wrapper = shallow(<ProjectEventPreview event={event.notPassedEvent} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly passed event', () => {
    const wrapper = shallow(<ProjectEventPreview event={event.passedEvent} />)
    expect(wrapper).toMatchSnapshot()
  })
})
