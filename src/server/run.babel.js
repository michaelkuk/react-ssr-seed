// All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel.
require('babel-register')({
  presets: [
    'react',
    'es2015',
    'es2017',
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-object-rest-spread',
    'dynamic-import-node-sync',
    'add-module-exports',
  ],
});

// Server Driver Code, everything from here on can use all the super future ES6 features!
module.exports = require('./server.js');
