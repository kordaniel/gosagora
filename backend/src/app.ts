import express from 'express';
import cors from 'cors';
import corsConfig from './utils/corsConfig';

import config from './utils/config';
import middleware from './utils/middleware';

const app = express();
if (!config.IS_PRODUCTION_ENV) {
  app.use(cors(corsConfig));
}

app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.sendStatus(200);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
