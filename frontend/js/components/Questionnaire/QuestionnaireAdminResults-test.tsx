/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { QuestionnaireAdminResults } from './QuestionnaireAdminResults'
import { $fragmentRefs, $refType } from '../../mocks'

describe('<QuestionnaireAdminResults />', () => {
  const allTypeOfQuestions = {
    questionnaire: {
      ' $refType': $refType,
      ' $fragmentRefs': $fragmentRefs,
      questions: [
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '1',
          title: 'question type select',
          type: 'select',
          __typename: 'MultipleChoiceQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 7,
          },
          allResponses: {
            totalCount: 14,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '2',
          title: 'question type radio',
          type: 'radio',
          __typename: 'MultipleChoiceQuestion',
          required: true,
          private: false,
          participants: {
            totalCount: 98,
          },
          allResponses: {
            totalCount: 98,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '3',
          title: 'question type checkbox',
          type: 'checkbox',
          __typename: 'MultipleChoiceQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 45,
          },
          allResponses: {
            totalCount: 48,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '4',
          title: 'section',
          type: 'section',
          __typename: 'SectionQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 2,
          },
          allResponses: {
            totalCount: 4,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '5',
          title: 'question type button',
          type: 'button',
          __typename: 'MultipleChoiceQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 43,
          },
          allResponses: {
            totalCount: 43,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '6',
          title: 'question type ranking',
          type: 'ranking',
          __typename: 'MultipleChoiceQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 38,
          },
          allResponses: {
            totalCount: 0,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '7',
          title: 'question type text',
          type: 'text',
          __typename: 'SimpleQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 4,
          },
          allResponses: {
            totalCount: 4,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '8',
          title: 'question type number',
          type: 'number',
          __typename: 'SimpleQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 89,
          },
          allResponses: {
            totalCount: 89,
          },
        },
        {
          ' $fragmentRefs': $fragmentRefs,
          id: '9',
          title: 'question type number',
          type: 'medias',
          __typename: 'MediaQuestion',
          required: false,
          private: false,
          participants: {
            totalCount: 9,
          },
          allResponses: {
            totalCount: 9,
          },
        },
      ],
    },
    logoUrl: '/logo',
    backgroundColor: '#897897',
  }
  const withoutQuestions = {
    questionnaire: {
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      questions: [],
    },
    logoUrl: '/logo',
    backgroundColor: '#897897',
  }
  const withoutParticipants = {
    questionnaire: {
      ' $refType': $refType,
      ' $fragmentRefs': $fragmentRefs,
      questions: [
        {
          id: '1',
          ' $fragmentRefs': $fragmentRefs,
          title: 'question type select',
          type: 'select',
          __typename: 'MultipleChoiceQuestion',
          required: false,
          private: true,
          participants: {
            totalCount: 0,
          },
          allResponses: {
            totalCount: 0,
          },
        },
      ],
    },
    logoUrl: '/logo',
    backgroundColor: '#897897',
  }
  it('renders correctly all type of questions', () => {
    const wrapper = shallow(<QuestionnaireAdminResults {...allTypeOfQuestions} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly without questions', () => {
    const wrapper = shallow(<QuestionnaireAdminResults {...withoutQuestions} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly with private question & without participants', () => {
    const wrapper = shallow(<QuestionnaireAdminResults {...withoutParticipants} />)
    expect(wrapper).toMatchSnapshot()
  })
})
