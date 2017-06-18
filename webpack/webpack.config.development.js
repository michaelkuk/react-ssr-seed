import path from 'path';
import webpack from 'webpack';

const root = process.cwd();
const src = path.join(root, 'src');

const clientSrc = path.join(src, 'client');
const universalSrc = path.join(src, 'universal');

const clientInclude = [clientSrc, universalSrc];

const babelQuery = {
  presets: [
    'react',
    ['es2015', { modules: false }],
    'es2017',
    'stage-0',
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-object-rest-spread',
    'dynamic-import-node-sync',
  ],
};

export default {
  // devtool: 'eval',
  context: src,
  entry: {
    app: [
      'babel-polyfill/dist/polyfill.js',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?noInfo=false',
      './client/index.js',
    ],
  },
  output: {
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: false,
      __DEBUG__: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules'],
  },
  module: {
    loaders: [
      {
        test: /\.(png|j|jpeg|gif|svg|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },

      // Javascript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: babelQuery,
        include: clientInclude,
      },

      // CSS
      {
        test: /\.css|scss$/,
        include: clientInclude,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
