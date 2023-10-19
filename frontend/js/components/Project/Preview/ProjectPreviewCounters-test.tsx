/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { $refType, $fragmentRefs } from '../../../mocks'
import { ProjectPreviewCounters } from './ProjectPreviewCounters'

const props = {
  project: {
    ' $fragmentRefs': $fragmentRefs,
    ' $refType': $refType,
    id: 'UHJvamVjdDpwcm9qZWN0MQ==',
    districts: {
      totalCount: 0,
      edges: [],
    },
    contributors: {
      totalCount: 48,
    },
    votes: {
      totalCount: 48,
    },
    anonymousVotes: {
      totalCount: 12,
    },
    anonymousReplies: {
      totalCount: 12,
    },
    contributions: {
      totalCount: 71,
    },
    isExternal: false,
    hasParticipativeStep: true,
    isVotesCounterDisplayable: true,
    isContributionsCounterDisplayable: true,
    isParticipantsCounterDisplayable: true,
    type: {
      title: 'project.types.interpellation',
    },
    archived: false,
  },
}
const archivedProjectProps = {
  project: { ...props.project, archived: true },
}
const propsWithDistricts = {
  project: {
    ' $fragmentRefs': $fragmentRefs,
    ' $refType': $refType,
    id: 'project2',
    isExternal: false,
    hasParticipativeStep: true,
    districts: {
      totalCount: 5,
      edges: [
        {
          node: {
            name: 'zone 1',
          },
        },
        {
          node: {
            name: 'zone 2',
          },
        },
        {
          node: {
            name: 'zone 3',
          },
        },
        {
          node: {
            name: 'zone 4',
          },
        },
        {
          node: {
            name: 'zone 5',
          },
        },
      ],
    },
    contributors: {
      totalCount: 48,
    },
    anonymousVotes: {
      totalCount: 12,
    },
    anonymousReplies: {
      totalCount: 12,
    },
    votes: {
      totalCount: 54,
    },
    contributions: {
      totalCount: 89,
    },
    isVotesCounterDisplayable: true,
    isContributionsCounterDisplayable: true,
    isParticipantsCounterDisplayable: true,
    type: {
      title: 'global.consultation',
    },
    archived: false,
  },
}
describe('<ProjectPreviewCounters />', () => {
  it('should render correctly counters without districts', () => {
    const wrapper = shallow(<ProjectPreviewCounters {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly counters with districts', () => {
    const wrapper = shallow(<ProjectPreviewCounters {...propsWithDistricts} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly counters when project is archived', () => {
    const wrapper = shallow(<ProjectPreviewCounters {...archivedProjectProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
