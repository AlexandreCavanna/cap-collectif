/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { $refType, $fragmentRefs } from '../../../mocks'
import { ProjectPreviewExternalCounters } from './ProjectPreviewExternalCounters'

const props = {
  project: {
    ' $fragmentRefs': $fragmentRefs,
    ' $refType': $refType,
    id: 'externalProject',
    externalLink: 'https://github.com/cap-collectif/platform/issues/8639',
    externalContributionsCount: 234,
    externalVotesCount: 534,
    externalParticipantsCount: 54,
    archived: false,
  },
}
const archivedProjectProps = {
  project: { ...props.project, archived: true },
}
const propsWithoutCounter = {
  project: {
    ' $fragmentRefs': $fragmentRefs,
    ' $refType': $refType,
    id: 'externalProject',
    externalLink: 'https://github.com/cap-collectif/platform/issues/8639',
    externalContributionsCount: 234,
    externalVotesCount: null,
    externalParticipantsCount: 0,
    archived: false,
  },
}
describe('<ProjectPreviewProgressBar />', () => {
  it('should render correctly an external project with counter', () => {
    const wrapper = shallow(<ProjectPreviewExternalCounters {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly an external project without counter of votes but with participants', () => {
    const wrapper = shallow(<ProjectPreviewExternalCounters {...propsWithoutCounter} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly an archived external project', () => {
    const wrapper = shallow(<ProjectPreviewExternalCounters {...archivedProjectProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
