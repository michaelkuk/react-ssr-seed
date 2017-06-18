import React from 'react';
import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  resolve: () => import('./containers/Home'),
  LoadingComponent: () => (<div>Loading...</div>),
});
