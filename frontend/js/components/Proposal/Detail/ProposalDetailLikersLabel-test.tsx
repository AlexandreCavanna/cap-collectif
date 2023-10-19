/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { ProposalDetailLikersLabel } from './ProposalDetailLikersLabel'
import { $refType } from '../../../mocks'

describe('<ProposalDetailLikersLabel />', () => {
  const proposal = {
    ' $refType': $refType,
    id: '1',
    likers: [
      {
        id: '1',
      },
    ],
  }
  const proposalWithLikers = {
    ' $refType': $refType,
    id: '1',
    likers: [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ],
  }
  const proposalWithoutLikers = {
    ' $refType': $refType,
    id: '1',
    likers: [],
  }
  it('should render truncated liker name when only one liker', () => {
    const wrapper = shallow(<ProposalDetailLikersLabel title="test" onClick={() => {}} proposal={proposal} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render a <FormattedMessage/> when several likers', () => {
    const wrapper = shallow(<ProposalDetailLikersLabel title="test" onClick={() => {}} proposal={proposalWithLikers} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render nothing when no likers', () => {
    const wrapper = shallow(
      <ProposalDetailLikersLabel title="test" onClick={() => {}} proposal={proposalWithoutLikers} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
