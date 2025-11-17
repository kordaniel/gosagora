import cors from 'cors';
import express from 'express';

import authRouter from './routes/auth';
import boatRouter from './routes/boat';
import raceRouter from './routes/race';
import trailRouter from './routes/trail';
import userRouter from './routes/user';

import config from './utils/config';
import corsConfig from './utils/corsConfig';
import middleware from './utils/middleware';

const app = express();
if (!config.IS_PRODUCTION_ENV) {
  app.use(cors(corsConfig));
}

app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.sendStatus(200);
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/boat', boatRouter);
app.use('/api/v1/race', raceRouter);
app.use('/api/v1/trail', trailRouter);
app.use('/api/v1/user', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
