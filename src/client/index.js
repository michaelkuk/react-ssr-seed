import React from 'react';
import { render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import asyncBootstrapper from 'react-async-bootstrapper';
import { AsyncComponentProvider } from 'react-async-component';
import axios from 'axios';

import ReactHotLoader from './components/ReactHotLoader';
import createStore from '../universal/store/createStore';
import App from '../universal';

import '../universal/styles/main.scss';

const container = document.querySelector('#root');

const supportsHistory = 'pushState' in window.history;

const asyncComponentsRehydrateState = window.ASYNC_COMPONENTS_STATE;

// eslint-disable-next-line no-underscore-dangle
const INITIAL_STATE = window.__INITIAL_STATE__;

const axiosIntance = axios.create({
  headers: {
    common: {},
  },
});

const store = createStore({ axios: axiosIntance }, INITIAL_STATE);

const renderApp = (Component) => {
  // Firstly, define our full application component, wrapping the given
  // component app with a browser based version of react router.
  const app = (
    <AsyncComponentProvider rehydrateState={asyncComponentsRehydrateState}>
      <ReactHotLoader>
        <BrowserRouter forceRefresh={!supportsHistory}>
          <Component store={store} />
        </BrowserRouter>
      </ReactHotLoader>
    </AsyncComponentProvider>
  );

  // We use the react-async-component in order to support code splitting of
  // our bundle output. It's important to use this helper.
  // @see https://github.com/ctrlplusb/react-async-component
  asyncBootstrapper(app).then(() => render(app, container));
};

renderApp(App);

// The following is needed so that we can support hot reloading our application.
if (module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept('../universal/index', () => {
    renderApp(require('../universal/index')); // eslint-disable-line global-require
  });
}
