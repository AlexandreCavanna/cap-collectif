import * as React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Navbar as Navigation, Nav } from 'react-bootstrap';
import NavbarRight from './NavbarRight';
import NavbarItem from './NavbarItem';

type Props = {
  intl: intlShape,
  logo?: ?string,
  items: Array,
  siteName: ?string,
};

class Navbar extends React.Component<Props> {
  render() {
    const { logo, intl, items, siteName } = this.props;

    const navbarLgSize = (
      <Nav id="navbar-content" className="visible-lg-block">
        {items.filter((item, index) => index < 6).map((header, index) => {
          return <NavbarItem key={index} item={header} />;
        })}
        {items.length > 6 && (
          <NavbarItem
            item={{
              id: 'see-more',
              title: intl.formatMessage({ id: 'global.navbar.see_more' }),
              hasEnabledFeature: true,
              children: items.filter((item, index) => index >= 6),
            }}
            className="navbar-dropdown-more"
          />
        )}
      </Nav>
    );

    const navbarMdSize = (
      <Nav id="navbar-content" className="visible-md-block">
        {items.filter((item, index) => index < 4).map((header, index) => {
          return <NavbarItem key={index} item={header} />;
        })}
        {items.length > 4 && (
          <NavbarItem
            item={{
              id: 'see-more',
              title: intl.formatMessage({ id: 'global.navbar.see_more' }),
              hasEnabledFeature: true,
              children: items.filter((item, index) => index >= 4),
            }}
            className="navbar-dropdown-more"
          />
        )}
      </Nav>
    );

    const navbarSmSize = (
      <Nav id="navbar-content" className="visible-sm-block">
        {items.filter((item, index) => index < 2).map((header, index) => {
          return <NavbarItem key={index} item={header} />;
        })}
        {items.length > 2 && (
          <NavbarItem
            item={{
              id: 'see-more',
              title: intl.formatMessage({ id: 'global.navbar.see_more' }),
              hasEnabledFeature: true,
              children: items.filter((item, index) => index >= 2),
            }}
            className="navbar-dropdown-more"
          />
        )}
      </Nav>
    );

    const navbarXsSize = (
      <Nav id="navbar-content" className="visible-xs-block">
        {items.map((header, index) => {
          return <NavbarItem key={index} item={header} />;
        })}
      </Nav>
    );

    return (
      <Navigation id="main-navbar" className="navbar navbar-default navbar-fixed-top">
        <div className="skip-links js-skip-links" role="banner">
          <div className="skip-links-container">
            <div>
              <ul className="skip-links-list clearfix">
                <li>
                  <a href="#navbar">
                    <FormattedMessage id="navbar.skip_links.menu" />
                  </a>
                </li>
                <li>
                  <a href="#main">
                    <FormattedMessage id="navbar.skip_links.content" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <Navigation.Header>
            {logo && (
              <Navigation.Brand href="/" id="home">
                <a href="/">
                  <img src={logo} alt={siteName} />
                </a>
              </Navigation.Brand>
            )}
            <Navigation.Toggle />
          </Navigation.Header>
          <Navigation.Collapse>
            {navbarLgSize}
            {navbarMdSize}
            {navbarSmSize}
            {navbarXsSize}
            <NavbarRight />
          </Navigation.Collapse>
        </div>
      </Navigation>
    );
  }
}

export default injectIntl(Navbar);
