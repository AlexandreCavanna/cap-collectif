/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { ProposalViewAnalysisPanel } from './ProposalViewAnalysisPanel'
import { $fragmentRefs, $refType } from '~/mocks'

describe('<ProposalViewAnalysisPanel  /> ', () => {
  it('renders correctly', () => {
    const props = {
      proposal: {
        id: 'id',
        ' $refType': $refType,
        analyses: [
          {
            ' $fragmentRefs': $fragmentRefs,
            id: 'a1id',
            analyst: {
              id: 'userID345',
            },
            state: 'FAVOURABLE',
            responses: [
              {
                __typename: 'ValueResponse',
                question: {
                  id: 'q1',
                },
                ' $fragmentRefs': $fragmentRefs,
              },
            ],
          },
        ],
        form: {
          analysisConfiguration: {
            id: 'analysisConfigId',
            evaluationForm: {
              questions: [
                {
                  id: 'q1',
                },
                {
                  id: 'q2',
                },
              ],
            },
          },
        },
      },
      userId: 'userID345',
      viewer: {
        ' $refType': $refType,
        ' $fragmentRefs': $fragmentRefs,
      },
    }
    const wrapper = shallow(<ProposalViewAnalysisPanel {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly with ValueResponse and MediaResponse', () => {
    const props = {
      proposal: {
        id: 'id',
        ' $refType': $refType,
        analyses: [
          {
            ' $fragmentRefs': $fragmentRefs,
            id: 'a1id',
            analyst: {
              id: 'userID345',
            },
            state: 'FAVOURABLE',
            responses: [
              {
                __typename: 'ValueResponse',
                question: {
                  id: 'q1',
                },
                ' $fragmentRefs': $fragmentRefs,
              },
              {
                __typename: 'MediaResponse',
                question: {
                  id: 'q2',
                },
                ' $fragmentRefs': $fragmentRefs,
              },
            ],
          },
        ],
        form: {
          analysisConfiguration: {
            id: 'analysisConfigId',
            evaluationForm: {
              questions: [
                {
                  id: 'q1',
                },
                {
                  id: 'q2',
                },
              ],
            },
          },
        },
      },
      userId: 'userID345',
      viewer: {
        ' $refType': $refType,
        ' $fragmentRefs': $fragmentRefs,
      },
    }
    const wrapper = shallow(<ProposalViewAnalysisPanel {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
