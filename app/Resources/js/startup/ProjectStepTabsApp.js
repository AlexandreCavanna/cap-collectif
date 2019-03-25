// @flow
import React from 'react';
import { Provider } from 'react-redux';
import ReactOnRails from 'react-on-rails';
import IntlProvider from './IntlProvider';
import ProjectStepTabs, { type Props } from '../components/Project/ProjectStepTabs';

export default (props: Props) => (
  <Provider store={ReactOnRails.getStore('appStore')}>
    <IntlProvider>
      <ProjectStepTabs {...props} />
    </IntlProvider>
  </Provider>
);
