import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

// Paths
const root = process.cwd();
const src = path.join(root, 'src');
const build = path.join(root, 'build');

export default {
  context: src,
  entry: {
    server: './server/server.js',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  output: {
    path: build,
    chunkFilename: '[name]_[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __PRODUCTION__: true,
      __DEBUG__: false,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.node$/,
        use: [
          'node-loader',
        ],
      },
      {
        test: /\.(png|j|jpeg|gif|svg|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
            ['es2015', { modules: false }],
            'es2017',
            'stage-0',
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-object-rest-spread',
            'react-hot-loader/babel',
            'dynamic-import-node-sync',
          ],
        },
      },

    ],
  },
};
