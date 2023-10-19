/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { ProposalAdminPage } from './ProposalAdminPage'

describe('<ProposalAdminPage />', () => {
  const props = {
    proposalId: 1,
    dirty: false,
    proposalRevisionsEnabled: false,
    viewerIsAdmin: true,
  }
  it('render correctly', () => {
    const wrapper = shallow(<ProposalAdminPage {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
