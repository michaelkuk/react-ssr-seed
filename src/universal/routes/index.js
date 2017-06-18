import React from 'react';
import { Switch, Route } from 'react-router';

import Home from './Home';

const Routes = () => (
  <Switch>
    <Route exact match="/" component={Home} />
  </Switch>
);

export default Routes;
