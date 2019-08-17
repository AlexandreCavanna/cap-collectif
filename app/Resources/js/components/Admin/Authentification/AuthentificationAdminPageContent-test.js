// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { AuthentificationAdminPageContent } from './AuthentificationAdminPageContent';
import { $fragmentRefs, $refType } from '../../../mocks';

describe('<AuthentificationAdminPageContent />', () => {
  const defaultProps = {
    ssoConfigurations: {
      ...$refType,
      edges: [
        {
          node: {
            $fragmentRefs,
            id: 'oauth2ID',
            name: 'Open ID Provider',
            clientId: 'clientId',
            secret: 'SecretKey',
            authorizationUrl: 'https://localhost:8888/authorization',
            accessTokenUrl: 'https://localhost:8888/token',
            userInfoUrl: 'https://localhost:8888/user',
            logoutUrl: 'https://localhost:8888/logout',
            profileUrl: 'https://localhost:8888/profile',
          },
        },
      ],
    },
    shieldAdminForm: {
      ...$refType,
      shieldMode: true,
      introduction: '<p>Introduction text in shield mode</p>',
      media: {
        id: 'image-uuid',
        name: 'image-name.jpg',
        url: 'https://capco.test/media/default/0001/01/image-name.jpg',
      },
    },
    features: {
      ...features,
      list_sso: true,
    },
    isSuperAdmin: true,
  };

  it('renders correctly', () => {
    const wrapper = shallow(<AuthentificationAdminPageContent {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when not superAdmin', () => {
    const props = {
      ...defaultProps,
      isSuperAdmin: false,
    };
    const wrapper = shallow(<AuthentificationAdminPageContent {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
