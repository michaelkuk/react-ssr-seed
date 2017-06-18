import path from 'path';
import webpack from 'webpack';
// import qs from 'querystring';

// import autoprefixer from 'autoprefixer';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const root = process.cwd();
const src = path.join(root, 'src');
const build = path.join(root, 'build', 'public');

const clientSrc = path.join(src, 'client');
const universalSrc = path.join(src, 'universal');

const clientInclude = [clientSrc, universalSrc];

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
});

// Cache vendor && client javascript on CDN...
const vendor = [
  'react',
  'redux',
  'reselect',
  'react-redux',
  'react-router',
  'react-async-component',
  'react-helmet',
];

export default {
  context: src,
  entry: {
    app: [
      'babel-polyfill/dist/polyfill.js',
      './client/index.js',
    ],
    vendor,
  },
  output: {
    filename: '[name]_[chunkhash].js',
    chunkFilename: '[name]_[chunkhash].js',
    path: build,
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules'],
    unsafeCache: true,
  },
  node: {
    dns: 'mock',
    net: 'mock',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    // new ExtractTextPlugin('[name].css'),
    extractSass,
    new webpack.NormalModuleReplacementPlugin(/\.routeMap$/, './routeMapAsync.js'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    /* minChunkSize should be 50000 for production apps
     * 10 is for this example */
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10 }),
    new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false }, comments: /(?:)/ }),
    new AssetsPlugin({ path: build, filename: 'assets.json' }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: true,
      __DEBUG__: false,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
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

      // JavaScript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: clientInclude,
      },

      // CSS
      {
        test: /\.css|scss$/,
        include: clientInclude,
        loaders: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
    ],
  },
};
