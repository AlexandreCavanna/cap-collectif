// @flow
import * as React from 'react';
import { Provider } from 'react-redux';
import ReactOnRails from 'react-on-rails';
import IntlProvider from './IntlProvider';
import ParisUserNotValidModal from '../components/User/Profile/ParisUserNotValidModal';

export default (props: Object) => (
  <Provider store={ReactOnRails.getStore('appStore')}>
    <IntlProvider>
      <ParisUserNotValidModal {...props} />
    </IntlProvider>
  </Provider>
);
