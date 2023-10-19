/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Navbar } from './Navbar'

const defaultProps = {
  home: 'https://capco.dev/en/',
  preferredLanguage: 'fr-FR',
  currentRouteName: 'app_homepage',
  currentRouteParams: [],
  localeChoiceTranslations: [
    {
      code: 'de-DE',
      message: 'Möchten Sie die Seite in Ihrer Sprache anzeigen?',
      label: 'Weiter',
    },
    {
      code: 'en-GB',
      message: 'Do you want to consult the website in your language?',
      label: 'Continue',
    },
    {
      code: 'fr-FR',
      message: 'Voulez-vous consulter le site dans votre langue ?',
      label: 'Continuer',
    },
  ],
  currentLanguage: 'fr-FR',
  logo: 'Navbar-logo.png',
  items: [],
  siteName: 'cap-collectif.com',
  contentRight: <div id="content-contentRight" />,
  isAuthenticated: false,
}
const noHeaderProps = {
  isMultilangueEnabled: false,
  languageList: [],
}
const headerProps = {
  isMultilangueEnabled: true,
  languageList: [
    {
      translationKey: 'french',
      code: 'fr-FR',
    },
    {
      translationKey: 'english',
      code: 'en-GB',
    },
  ],
}
describe('<Navbar />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Navbar {...defaultProps} {...noHeaderProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly with header', () => {
    const wrapper = shallow(<Navbar {...defaultProps} {...headerProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly when authenticated', () => {
    const wrapper = shallow(<Navbar {...defaultProps} {...headerProps} isAuthenticated />)
    expect(wrapper).toMatchSnapshot()
  })
})
