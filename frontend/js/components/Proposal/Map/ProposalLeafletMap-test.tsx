/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { ProposalLeafletMap } from './ProposalLeafletMap'
import { $fragmentRefs, $refType } from '~/mocks'

describe('<ProposalLeafletMap />', () => {
  const defaultMapOptions = {
    center: {
      lat: 48.8586047,
      lng: 2.3137325,
    },
    zoom: 12,
  }
  const proposals = [
    {
      id: 'pid1',
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      address: {
        lat: 49.8397,
        lng: 24.0297,
      },
      category: {
        icon: null,
        color: '#EEE',
      },
    },
    {
      id: 'pid2',
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      address: {
        lat: 52.2297,
        lng: 21.0122,
      },
      category: {
        icon: 'water',
        color: 'blue',
      },
    },
    {
      id: 'pid3',
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      address: null,
      category: {
        icon: null,
        color: 'red',
      },
    },
    {
      id: 'pid4',
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      address: {
        lat: 51.5074,
        lng: -0.0901,
      },
      category: {
        icon: 'wheelchair',
        color: 'purple',
      },
    },
  ]
  const props = {
    hasError: false,
    hasMore: false,
    isLoading: false,
    retry: jest.fn(),
    shouldDisplayPictures: true,
    proposalInAZoneRequired: false,
    dispatch: jest.fn(),
    proposalForm: {
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      objectType: 'PROPOSAL',
      contribuable: true,
    },
    projectType: 'PROPOSAL',
    isCollectStep: true,
    btnBgColor: '#4EE323',
    btnTextColor: '##FFF',
  }
  it('should render a map with only valid markers', () => {
    const wrapper = shallow(
      <ProposalLeafletMap {...props} defaultMapOptions={defaultMapOptions} visible proposals={proposals} />,
    )
    const popup = wrapper.find('ProposalLeafletMapstyle__BlankPopup')
    expect(wrapper).toMatchSnapshot()
    expect(popup).toHaveLength(3)
  })
  it('should not render a map with visible = false', () => {
    const wrapper = shallow(
      <ProposalLeafletMap {...props} defaultMapOptions={defaultMapOptions} visible={false} proposals={proposals} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should render a map with proposals still loading', () => {
    const wrapper = shallow(
      <ProposalLeafletMap
        {...props}
        hasMore
        isLoading
        defaultMapOptions={defaultMapOptions}
        visible
        proposals={proposals}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
