// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { ProposalViewAnalysisPanel } from './ProposalViewAnalysisPanel';
import { $fragmentRefs, $refType } from '~/mocks';

describe('<ProposalViewAnalysisPanel  /> ', () => {
  it('renders correctly', () => {
    const props = {
      proposal: {
        id: 'id',
        $refType,
        analyses: [
          {
            id: 'a1id',
            updatedBy: {
              id: 'userID345',
            },
            comment: 'mwe',
            state: 'FAVOURABLE',
            responses: [
              {
                question: { id: 'q1' },
                $fragmentRefs,
              },
            ],
          },
        ],
        form: {
          analysisConfiguration: {
            id: 'analysisConfigId',
            evaluationForm: {
              questions: [{ id: 'q1' }, { id: 'q2' }],
            },
          },
        },
      },
      userId: 'userID345',
    };

    const wrapper = shallow(<ProposalViewAnalysisPanel {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});