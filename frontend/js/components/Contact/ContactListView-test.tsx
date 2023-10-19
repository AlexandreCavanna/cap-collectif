/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { ContactsListView } from './ContactsListView'
import { $fragmentRefs, $refType } from '../../mocks'

describe('<ContactForm />', () => {
  const defaultContactForm = {
    ' $fragmentRefs': $fragmentRefs,
    title: 'Contact form 1',
  }
  const defaultQuery = {
    ' $refType': $refType,
    contactForms: [defaultContactForm, defaultContactForm],
  }
  const defaultProps = {
    query: { ...defaultQuery },
  }
  it('should render correctly', () => {
    const wrapper = shallow(<ContactsListView {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with only one contactForm', () => {
    const props = { ...defaultProps, query: { ...defaultQuery, contactForms: [defaultContactForm] } }
    const wrapper = shallow(<ContactsListView {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with no contactForm', () => {
    const props = { ...defaultProps, query: { ...defaultQuery, contactForms: [] } }
    const wrapper = shallow(<ContactsListView {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
