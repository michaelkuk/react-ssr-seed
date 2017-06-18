import {
  createStore,
  compose,
} from 'redux';

import reducers from './reducers';

export default ({ axios }, initialState = {}) => {
  const store = createStore(reducers, initialState, compose(
    window && __DEBUG__ && window.devToolsExtension ? window.devToolsExtension() : f => f
  ));


  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducers = require('./reducers').Default; // eslint-disable-line global-require

      store.replaceReducer(nextReducers);
    });
  }


  return store;
};
