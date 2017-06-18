import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import Routes from '../routes';

const App = ({ store }) => (
  <Provider store={store}>
    <div>
      <Helmet>
        <title>Hello Helmet</title>
      </Helmet>
      <Routes />
    </div>
  </Provider>
);

App.propTypes = {
  store: PropTypes.shape().isRequired,
};

export default App;
