/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { OpinionSourceBox } from './OpinionSourceBox'
import { $refType, $fragmentRefs } from '../../../mocks'

describe('<OpinionSourceBox />', () => {
  it('renders correcty', () => {
    const sourceable = {
      id: 'opinion1',
      allSources: {
        totalCount: 5,
      },
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      viewerSourcesUnpublished: {
        totalCount: 2,
        edges: [
          {
            node: {
              id: 'source1',
              ' $fragmentRefs': $fragmentRefs,
            },
          },
          {
            node: {
              id: 'source2',
              ' $fragmentRefs': $fragmentRefs,
            },
          },
        ],
      },
    }
    const wrapper = shallow(<OpinionSourceBox isAuthenticated sourceable={sourceable} />)
    expect(wrapper).toMatchSnapshot()
  })
})
