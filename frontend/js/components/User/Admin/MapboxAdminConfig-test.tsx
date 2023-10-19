/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { MapboxAdminConfig } from './MapboxAdminConfig'
import { formMock, $refType } from '~/mocks'

describe('<MapboxAdminConfig/>', () => {
  const defaultMapToken = {
    ' $refType': $refType,
    id: '1',
    publicToken: '1publicToken2',
    secretToken: '3secretToken4',
    provider: 'MAPBOX',
    styleOwner: 'capcollectif',
    styleId: 'lebotheme',
    styles: [],
  }
  it('should render', () => {
    const props = { ...formMock, mapToken: defaultMapToken }
    const wrapper = shallow(<MapboxAdminConfig {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render with styles', () => {
    const props = {
      ...formMock,
      mapToken: {
        ...defaultMapToken,
        styles: [
          {
            id: 'mapStyle1',
            owner: 'capcollectif',
            name: 'Le bo thème',
            previewUrl:
              'https://api.mapbox.com/styles/v1/capcollectif/lebotheme/tiles/256/14/8114/5686?access_token=INSERT_A_REAL_SECRET',
            createdAt: '2018-11-23 00:00:00',
            updatedAt: null,
            isCurrent: true,
          },
          {
            id: 'mapStyle2',
            owner: 'capcollectif',
            name: 'Le bo thème 2',
            previewUrl:
              'https://api.mapbox.com/styles/v1/capcollectif/lebotheme2/tiles/256/14/8114/5686?access_token=INSERT_A_REAL_SECRET',
            createdAt: '2018-11-23 00:00:00',
            updatedAt: '2018-11-23 10:00:00',
            isCurrent: false,
          },
        ],
      },
    }
    const wrapper = shallow(<MapboxAdminConfig {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
