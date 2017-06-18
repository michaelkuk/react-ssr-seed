import express, { Router } from 'express';
import compression from 'compression';
import path from 'path';

const productionMiddleware = () => {
  const router = Router();

  router.use(compression());
  router.use('/static', express.static(path.join(__dirname, 'public')));

  return router;
};

export default productionMiddleware;
