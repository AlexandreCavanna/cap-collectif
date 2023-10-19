/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { ProjectAdminForm } from './ProjectAdminForm'
import { formMock, intlMock, $refType, $fragmentRefs } from '~/mocks'

describe('<ProjectAdminForm />', () => {
  const defaultProps = {
    ...formMock,
    intl: intlMock,
    title: 'testTitle',
    onTitleChange: jest.fn(),
    project: {
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      id: '1',
      title: 'testTitle',
      type: {
        id: '1',
      },
      video: 'dailymotion.com/issou',
      cover: null,
      authors: [],
      steps: [],
      themes: [],
      districts: null,
      metaDescription: 'so meta',
      opinionCanBeFollowed: true,
      isExternal: false,
      externalLink: null,
      publishedAt: '22/22/22',
      url: '/project1',
      visibility: 'ADMIN',
      externalVotesCount: null,
      externalParticipantsCount: null,
      externalContributionsCount: null,
      locale: null,
      restrictedViewers: null,
      address: null,
      firstCollectStep: {
        form: {
          isGridViewEnabled: true,
          isListViewEnabled: false,
          isMapViewEnabled: false,
        },
      },
      archived: false,
    },
    viewerIsAdmin: false,
    initialGroups: [],
    hasIdentificationCodeLists: true,
    query: {
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
    },
  }
  it('renders correctly empty', () => {
    const wrapper = shallow(<ProjectAdminForm {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
