import express from 'express';

import middleware from './utils/middleware';

const app = express();
app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.sendStatus(200);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
