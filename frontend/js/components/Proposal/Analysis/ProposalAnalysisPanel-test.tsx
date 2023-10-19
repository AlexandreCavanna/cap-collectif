/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { ProposalAnalysisPanel } from './ProposalAnalysisPanel'
import { $fragmentRefs, $refType } from '~/mocks'

describe('<ProposalAnalysisPanel />', () => {
  it('renders correctly', () => {
    const props = {
      proposal: {
        ' $refType': $refType,
        ' $fragmentRefs': $fragmentRefs,
        id: 'proposalId',
        analysts: [
          {
            id: 'Eva',
            displayName: 'Eva la Bg',
            ' $fragmentRefs': $fragmentRefs,
          },
          {
            id: 'Pipoune',
            displayName: 'Pipoune le Bg',
            ' $fragmentRefs': $fragmentRefs,
          },
        ],
        decisionMaker: {
          id: 'Ush',
          displayName: 'Ush le Bg',
          ' $fragmentRefs': $fragmentRefs,
        },
        supervisor: {
          id: 'Ruel',
          displayName: 'Ruel le Bg',
          ' $fragmentRefs': $fragmentRefs,
        },
        analyses: [
          {
            id: 'analyse2Id',
            state: 'FAVOURABLE',
            analyst: {
              id: 'Pipoune',
            },
          },
        ],
        assessment: {
          id: 'assessmentId',
          state: 'UNFAVOURABLE',
          supervisor: {
            id: 'Ruel',
          },
        },
        decision: {
          id: 'decisionId',
          state: 'IN_PROGRESS',
          decisionMaker: {
            id: 'Ush',
          },
          isApproved: false,
        },
        viewerCanDecide: true,
        viewerCanAnalyse: false,
        viewerCanEvaluate: false,
      },
      onClose: jest.fn(),
      user: {
        id: 'Rubilax',
        displayName: 'Skusku',
      },
      viewer: {
        ' $fragmentRefs': $fragmentRefs,
        ' $refType': $refType,
      },
    }
    const wrapper = shallow(<ProposalAnalysisPanel {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
