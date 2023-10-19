/* eslint-env jest */
import * as React from 'react'
import { render } from 'enzyme'
import { DebateStepPageVote } from './DebateStepPageVote'
import { $refType } from '~/mocks'
import { MockProviders } from '~/testUtils'

const baseProps = {
  step: {
    ' $refType': $refType,
    isAnonymousParticipationAllowed: false,
    debate: {
      url: '/debate123',
      id: 'debate-123',
      yesVotes: {
        totalCount: 12,
      },
      votes: {
        totalCount: 20,
      },
    },
  },
}
const props = {
  basic: baseProps,
  anonymousParticipationAllowed: { ...baseProps, step: { ...baseProps.step, isAnonymousParticipationAllowed: true } },
}
const normalUser = {
  user: {
    isEmailConfirmed: true,
  },
}
const nonConfirmedUser = {
  user: {
    isEmailConfirmed: false,
  },
}
const nonAuthenticated = {
  user: null,
}
describe('<DebateStepPageVote/>', () => {
  it('should renders correctly', () => {
    const wrapper = render(
      <MockProviders
        store={{
          user: normalUser,
        }}
        useCapUIProvider
      >
        <DebateStepPageVote {...props.basic} />
      </MockProviders>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should renders correctly when not authenticated', () => {
    const wrapper = render(
      <MockProviders
        store={{
          user: nonAuthenticated,
        }}
        useCapUIProvider
      >
        <DebateStepPageVote {...props.basic} />
      </MockProviders>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should renders correctly with email not confirmed argument', () => {
    const wrapper = render(
      <MockProviders
        store={{
          user: nonConfirmedUser,
        }}
        useCapUIProvider
      >
        <DebateStepPageVote {...props.basic} />
      </MockProviders>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should renders correctly with anonymous participation', () => {
    const wrapper = render(
      <MockProviders
        store={{
          user: normalUser,
        }}
        useCapUIProvider
      >
        <DebateStepPageVote {...props.anonymousParticipationAllowed} />
      </MockProviders>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
