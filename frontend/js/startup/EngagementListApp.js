// @flow
import * as React from 'react';
import { Provider } from 'react-redux';
import ReactOnRails from 'react-on-rails';
import IntlProvider from './IntlProvider';
import EngagementList from '~/components/InteClient/Engagement/EngagementList/EngagementList';

export default (props: Object) => (
  <Provider store={ReactOnRails.getStore('appStore')}>
    <IntlProvider>
      <EngagementList {...props} />
    </IntlProvider>
  </Provider>
);