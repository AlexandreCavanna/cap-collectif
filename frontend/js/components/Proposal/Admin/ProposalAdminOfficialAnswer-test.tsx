/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { ProposalAdminOfficialAnswer } from './ProposalAdminOfficialAnswer'
import { $refType, $fragmentRefs } from '~/mocks'

describe('<ProposalAdminOfficialAnswer />', () => {
  const proposal = {
    id: 'proposal3',
    ' $refType': $refType,
    ' $fragmentRefs': $fragmentRefs,
    officialResponse: null,
    form: {
      adminUrl: '/adminurl',
    },
  }
  const viewer = {
    ' $refType': $refType,
    ' $fragmentRefs': $fragmentRefs,
  }
  const officialResponse = {
    id: 'response',
    authors: [],
    body: '<p>slt</p>',
    publishedAt: '2017-02-01 00:03:00',
  }
  it('render correctly with analysis', () => {
    const wrapper = shallow(
      <ProposalAdminOfficialAnswer
        proposal={{
          ...proposal,
          project: {
            id: 'project5',
            hasAnalysis: true,
          },
        }}
        viewer={viewer}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('render correctly without response', () => {
    const wrapper = shallow(
      <ProposalAdminOfficialAnswer
        proposal={{
          ...proposal,
          project: {
            id: 'project5',
            hasAnalysis: false,
          },
        }}
        viewer={viewer}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('render correctly with response', () => {
    const wrapper = shallow(
      <ProposalAdminOfficialAnswer
        proposal={{
          ...proposal,
          officialResponse,
          project: {
            id: 'project5',
            hasAnalysis: false,
          },
        }}
        viewer={viewer}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
