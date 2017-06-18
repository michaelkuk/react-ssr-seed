import express from 'express';
import { readFileSync } from 'fs';
import { join, basename } from 'path';

import devMiddleware from './devMiddleware';
import productionMiddleware from './productionMiddleware';
import ssrHandler from './ssrHandler';

// fix undefined errors in universal context
global.window = null;

const DEV_ENV = process.env.NODE_ENV === 'development';
const app = express();
let assets = null;

if (DEV_ENV) {
  // Register development middleware
  app.use(devMiddleware());
} else {
  // Register production middleware
  app.use(productionMiddleware());

  // Reuse statement to setup production assets
  assets = require('../../build/public/assets.json'); // eslint-disable-line
  assets.text = readFileSync(join(__dirname, 'public', basename(assets.manifest.js)), 'utf8');
}

app.get('*', ssrHandler(DEV_ENV, assets));

// TODO: Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(process.env.PORT || 3000);
