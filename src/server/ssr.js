import React from 'react';
import asyncBootstrapper from 'react-async-bootstrapper';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router';
import axios from 'axios';

import createStore from '../universal/store/createStore';
import App from '../universal/index';

// TODO: Solve require cache for SSR
const createServerRenderer = ({ bootstrapper = asyncBootstrapper, renderer = renderToString } = {}) => url =>
  new Promise((resolve) => {
    const store = createStore({ axios });
    const asyncContext = createAsyncContext();
    const routerContext = {};

    const ServerComponent = (
      <AsyncComponentProvider asyncContext={asyncContext}>
        <StaticRouter context={routerContext} location={url}>
          <App store={store} />
        </StaticRouter>
      </AsyncComponentProvider>
    );

    bootstrapper(ServerComponent).then(() => {
      const html = renderer(ServerComponent);
      const helmet = Helmet.renderStatic();

      resolve({ html, asyncContext, routerContext, store, helmet });
    });
  });

export default createServerRenderer;
