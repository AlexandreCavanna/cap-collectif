/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { features } from '../../redux/modules/default'
import { ProposalFormAdminConfigurationForm, validate } from './ProposalFormAdminConfigurationForm'
import { intlMock, formMock, $refType, relayRefetchMock, $fragmentRefs, googleAddressMock } from '~/mocks'

describe('<ProposalFormAdminConfigurationForm />', () => {
  const proposalForm = {
    ' $fragmentRefs': $fragmentRefs,
    ' $refType': $refType,
    canContact: false,
    allowAknowledge: true,
    descriptionMandatory: true,
    objectType: 'PROPOSAL',
    id: 'proposalFormId',
    description: 'description',
    descriptionUsingJoditWysiwyg: false,
    usingThemes: true,
    themeMandatory: true,
    usingCategories: true,
    categoryMandatory: true,
    usingAddress: true,
    usingDescription: true,
    usingIllustration: false,
    usingSummary: false,
    mapCenter: {
      lat: 0,
      lng: 0,
      json: googleAddressMock.json,
    },
    zoomMap: 0,
    illustrationHelpText: '',
    addressHelpText: '',
    themeHelpText: '',
    categoryHelpText: '',
    descriptionHelpText: '',
    proposalInAZoneRequired: true,
    summaryHelpText: '',
    titleHelpText: '',
    usingDistrict: true,
    districtHelpText: '',
    districtMandatory: true,
    isMapViewEnabled: false,
    isListViewEnabled: false,
    isGridViewEnabled: false,
    categories: [
      {
        id: 'category1',
        name: 'Category 1 ',
        categoryImage: null,
        icon: 'wheelchair',
        color: 'purple',
      },
    ],
    districts: [],
    questions: [
      {
        id: 'field-1',
        title: 'Titre 1',
        required: false,
        hidden: false,
        level: 0,
        helpText: null,
        description: 'des cryptes Sion',
        descriptionUsingJoditWysiwyg: false,
        type: 'text',
        __typename: 'SimpleQuestion',
        private: false,
        number: 1,
        position: 1,
        alwaysJumpDestinationQuestion: null,
        jumps: [],
        destinationJumps: [],
        rangeMin: null,
        rangeMax: null,
      },
    ],
    usingFacebook: true,
    usingWebPage: true,
    usingTwitter: true,
    usingInstagram: true,
    usingYoutube: true,
    usingLinkedIn: true,
  }
  const props = {
    ...formMock,
    intl: intlMock,
    query: {
      ' $fragmentRefs': $fragmentRefs,
      ' $refType': $refType,
      viewer: {
        isSuperAdmin: false,
      },
    },
    proposalForm,
    defaultLanguage: 'fr-FR',
    usingAddress: true,
    usingCategories: true,
    usingThemes: true,
    usingDistrict: true,
    usingDescription: true,
    usingIllustration: false,
    usingSummary: false,
    isMapViewEnabled: false,
    features,
    relay: relayRefetchMock,
  }
  it('render correctly', () => {
    const wrapper = shallow(<ProposalFormAdminConfigurationForm {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('render correctly with question type number', () => {
    const questionWithRange = {
      id: 'field-1',
      title: 'Titre 1',
      required: false,
      hidden: false,
      level: 0,
      helpText: null,
      description: 'des cryptes Sion',
      descriptionUsingJoditWysiwyg: false,
      type: 'number',
      __typename: 'SimpleQuestion',
      private: false,
      number: 1,
      position: 1,
      alwaysJumpDestinationQuestion: null,
      jumps: [],
      destinationJumps: [],
    }
    const ppForm = {
      ...proposalForm,
      questions: [{ ...questionWithRange, isRangeBetween: true, rangeMin: 0, rangeMax: 10000 }],
    }
    const numberProps = { ...props, proposalForm: ppForm }
    const wrapper = shallow(<ProposalFormAdminConfigurationForm {...numberProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('render error with question type number', () => {
    const ppForm = {
      ...proposalForm,
      questions: [
        {
          id: 'field-1',
          title: 'Titre 1',
          required: false,
          hidden: false,
          level: 0,
          helpText: null,
          description: 'des cryptes Sion',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          __typename: 'SimpleQuestion',
          private: false,
          number: 1,
          position: 1,
          alwaysJumpDestinationQuestion: null,
          jumps: [],
          destinationJumps: [],
          isRangeBetween: true,
          rangeMin: 10,
          rangeMax: 0,
        },
        {
          id: 'field-2',
          title: 'Titre 2',
          required: false,
          hidden: false,
          level: 0,
          helpText: null,
          description: 'des cryptes Sion',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          __typename: 'SimpleQuestion',
          private: false,
          number: 2,
          position: 2,
          alwaysJumpDestinationQuestion: null,
          jumps: [],
          destinationJumps: [],
          isRangeBetween: true,
          rangeMin: 0,
          rangeMax: 0,
        },
        {
          id: 'field-3',
          title: 'Titre 3',
          required: false,
          hidden: false,
          level: 0,
          helpText: null,
          description: 'des cryptes Sion',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          __typename: 'SimpleQuestion',
          private: false,
          number: 2,
          position: 2,
          alwaysJumpDestinationQuestion: null,
          jumps: [],
          destinationJumps: [],
          isRangeBetween: true,
          rangeMin: 1000,
          rangeMax: null,
        },
        {
          id: 'field-4',
          title: 'Titre 4',
          required: false,
          hidden: false,
          level: 0,
          helpText: null,
          description: 'des cryptes Sion',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          __typename: 'SimpleQuestion',
          private: false,
          number: 2,
          position: 2,
          alwaysJumpDestinationQuestion: null,
          jumps: [],
          destinationJumps: [],
          isRangeBetween: true,
          rangeMin: null,
          rangeMax: 10000,
        },
      ],
    }
    const numberProps = { ...props, proposalForm: ppForm }
    const wrapper = shallow(<ProposalFormAdminConfigurationForm {...numberProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('render error with question type number with value as 0', () => {
    const values = {
      viewEnabled: true,
      questions: [
        {
          title: 'titre 1',
          description: 'description 1',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          isRangeBetween: true,
          rangeMin: '0',
          rangeMax: '0',
        },
      ],
    }
    expect(validate(values)).toMatchSnapshot()
  })
  it('render error with question type number with value as null', () => {
    const values = {
      viewEnabled: true,
      questions: [
        {
          title: 'titre 1',
          description: 'description 1',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          isRangeBetween: true,
          rangeMin: null,
          rangeMax: null,
        },
      ],
    }
    expect(validate(values)).toMatchSnapshot()
  })
  it('render error with question type number with value as min > max', () => {
    const values = {
      viewEnabled: true,
      questions: [
        {
          title: 'titre 2',
          description: 'description 2',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          isRangeBetween: true,
          rangeMin: '1000',
          rangeMax: '10',
        },
      ],
    }
    expect(validate(values)).toMatchSnapshot()
  })
  it('render error with question type number with value as min < max', () => {
    const values = {
      viewEnabled: true,
      questions: [
        {
          title: 'titre 3',
          description: 'description 3',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          isRangeBetween: true,
          rangeMin: '1000',
          rangeMax: '1000000',
        },
      ],
    }
    expect(validate(values)).toMatchSnapshot()
  })
  it('render error with question type number with value as min equal 0 and max equal 10000', () => {
    const values = {
      viewEnabled: true,
      questions: [
        {
          title: 'titre 5',
          description: 'description 5',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          isRangeBetween: true,
          rangeMin: '0',
          rangeMax: '10000',
        },
      ],
    }
    expect(validate(values)).toMatchSnapshot()
  })
  it('render error with question type number with value as min equal 1000 and max equal 0', () => {
    const values = {
      viewEnabled: true,
      questions: [
        {
          title: 'titre 6',
          description: 'description 6',
          descriptionUsingJoditWysiwyg: false,
          type: 'number',
          isRangeBetween: true,
          rangeMin: '1000',
          rangeMax: '0',
        },
      ],
    }
    expect(validate(values)).toMatchSnapshot()
  })
})
