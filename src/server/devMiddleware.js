import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import devWebpackConfig from '../../webpack/webpack.config.development';

const devMiddleware = () => {
  const router = Router();

  const compiler = webpack(devWebpackConfig);

  router.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    hot: true,
    publicPath: devWebpackConfig.output.publicPath,
  }));

  router.use(webpackHotMiddleware(compiler, {
    log: console.log, // eslint-disable-line no-console
    reload: true,
  }));

  return router;
};

export default devMiddleware;
