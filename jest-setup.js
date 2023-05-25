// @flow
/* eslint-env jest */
/* eslint-disable no-console */

import 'babel-polyfill';
import 'whatwg-fetch';

import $ from 'jquery';
// $FlowFixMe
import moment from 'moment-timezone';
// $FlowFixMe
import 'moment/locale/fr';
// $FlowFixMe
import { configure } from 'enzyme';
// $FlowFixMe
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as React from 'react';
// $FlowFixMe
import ReactTestRenderer from 'react-test-renderer';
import { type GraphQLTaggedNode, type Environment, QueryRenderer } from 'react-relay';
import { Provider } from 'react-redux';
import { IntlProvider, type IntlShape, type MessageDescriptor } from 'react-intl';
// $FlowFixMe
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';
import { createStore } from 'redux';
import { initialState as initialDefaultState } from './frontend/js/redux/modules/default';

configure({ adapter: new Adapter() });

moment.locale('fr');
moment.tz.setDefault('Europe/Paris');

// $FlowFixMe
global.$ = require('jquery')(window);
// $FlowFixMe
global.$ = $;
// $FlowFixMe
global.jQuery = $;

global.Cookies = {
  getJSON: () => '',
  set: () => '',
  get: () => {},
};

global.Modernizr = {
  intl: true,
};

global.window.__SERVER__ = false;

// This mock works only with a normal function (source: https://stackoverflow.com/a/67575349)
// eslint-disable-next-line func-names
global.window.IntersectionObserver = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
  };
};

global.window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

// $FlowFixMe we are in jest mode
console.error = () => {};

// $FlowFixMe we are in jest mode
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * This is a global function to test Relay components.
 * You can provide the GraphQL query with a great mock API.
 * It supports passing a redux state.
 *
 * It's highly opinionated because it does a full render and not shallow-rendering.
 *
 * See: https://facebook.github.io/relay/docs/en/testing-relay-components.html#fragment-container-tests
 */
function renderWithRelay<Props>(
  ui: React.ComponentType<Props>,
  {
    initialState = {
      default: initialDefaultState,
      user: { user: null },
      intl: { locale: 'fr-FR', messages: {} },
    },
    store = createStore(() => initialState, initialState),
    query,
    props = {},
    spec,
    environment = createMockEnvironment(),
  }: {
    store: Object,
    query: GraphQLTaggedNode,
    environment: Environment,
    spec: Object,
    props: Props,
    initialState: Object,
  } = {},
) {
  const TestRenderer = () => (
    <Provider store={store}>
      <IntlProvider>
        <QueryRenderer
          environment={environment}
          query={query}
          variables={{}}
          render={({ error, props: relayProps }) => {
            if (relayProps) {
              return React.createElement(ui, { ...props, ...relayProps }, null);
            }
            if (error) {
              return <div>{error.message}</div>;
            }
            return <div>'Loading...'</div>;
          }}
        />
      </IntlProvider>
    </Provider>
  );

  const renderer = ReactTestRenderer.create(<TestRenderer />);

  // $FlowFixMe we need an MockEnvironnment type
  environment.mock.resolveMostRecentOperation(operation =>
    MockPayloadGenerator.generate(operation, spec),
  );
  return renderer;
}

global.renderWithRelay = renderWithRelay;

jest.mock('react-intl', () => {
  const intl: IntlShape = {
    locale: 'fr-FR',
    formats: {},
    messages: {},
    now: () => 0,
    formatHTMLMessage: (message: MessageDescriptor) => String(message),
    formatPlural: (message: string) => String(message),
    formatNumber: (message: string) => String(message),
    formatRelative: (message: string) => String(message),
    formatTime: (message: string) => String(message),
    formatDate: (message: string) => String(message),
    formatMessage: (message: MessageDescriptor) => String(message.id),
  };
  const RealIntl = jest.requireActual('react-intl');

  return {
    IntlProvider: RealIntl.IntlProvider,
    FormattedMessage: RealIntl.FormattedMessage,
    FormattedDate: RealIntl.FormattedDate,
    FormattedHTMLMessage: RealIntl.FormattedHTMLMessage,
    FormattedTime: RealIntl.FormattedTime,
    FormattedNumber: RealIntl.FormattedNumber,
    injectIntl: RealIntl.injectIntl,
    useIntl: () => intl,
  };
});

// By default all feature flags are disabled in tests.
global.mockFeatureFlag = jest.fn(() => false);
jest.mock('./frontend/js/utils/hooks/useFeatureFlag', () => {
  return global.mockFeatureFlag;
});

jest.mock('use-analytics', () => {
  return {
    useAnalytics: () => ({
      track: jest.fn(),
    }),
  };
});

jest.mock('react-on-rails', () => {
  const ReactOnRails = {
    getStore: () => {},
  };
  return ReactOnRails;
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    slug: 'slug',
  }),
  useLocation: () => ({
    state: {},
  }),
  useRouteMatch: () => ({ url: '/mock/url' }),
}));

jest.mock('@cap-collectif/ui', () => {
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 0.5;
  global.Math = mockMath;
  return {
    ...jest.requireActual('@cap-collectif/ui'),
  };
});

jest.mock('react-leaflet', () => {
  const MapContainer = props => <div data-testid="map">{props.children}</div>;
  return {
    ...jest.requireActual('react-leaflet'),
    useMapEvents: jest.fn(),
    MapContainer,
  };
});
