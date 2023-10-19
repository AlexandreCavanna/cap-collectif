/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { $refType } from '../../../mocks'
import { ProjectPreviewProgressBar } from './ProjectPreviewProgressBar'

const props = {
  project: {
    ' $refType': $refType,
    steps: [
      {
        id: 'Open step',
      },
      {
        id: 'Open step & timeless',
      },
      {
        id: 'closed step',
      },
      {
        id: 'future step',
      },
    ],
    archived: false,
  },
}
const archivedProjectProps = { ...props, project: { ...props.project, archived: true } }
const openStep = {
  actualStep: {
    ' $refType': $refType,
    state: 'OPENED',
    timeless: false,
  },
}
const timelessStep = {
  actualStep: {
    ' $refType': $refType,
    state: 'OPENED',
    timeless: true,
  },
}
const closedStep = {
  actualStep: {
    ' $refType': $refType,
    state: 'CLOSED',
    timeless: false,
  },
  isCurrentStep: false,
}
const futureStep = {
  actualStep: {
    ' $refType': $refType,
    state: 'FUTURE',
    timeless: false,
  },
}
const closedAndCurrentStep = {
  actualStep: {
    ' $refType': $refType,
    state: 'CLOSED',
    timeless: false,
  },
  isCurrentStep: true,
}
describe('<ProjectPreviewProgressBar />', () => {
  it('should render correctly progress bar for open step', () => {
    const wrapper = shallow(<ProjectPreviewProgressBar {...props} {...openStep} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly progress bar for open & timeless step', () => {
    const wrapper = shallow(<ProjectPreviewProgressBar {...props} {...timelessStep} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly progress bar for closed step', () => {
    const wrapper = shallow(<ProjectPreviewProgressBar {...props} {...closedStep} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly progress bar for future step', () => {
    const wrapper = shallow(<ProjectPreviewProgressBar {...props} {...futureStep} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly progress bar for closed step which remains a current step', () => {
    const wrapper = shallow(<ProjectPreviewProgressBar {...props} {...closedAndCurrentStep} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly progress bar for archived project', () => {
    const wrapper = shallow(<ProjectPreviewProgressBar {...archivedProjectProps} {...openStep} />)
    expect(wrapper).toMatchSnapshot()
  })
})
