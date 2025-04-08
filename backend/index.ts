import express from 'express';

import config from './src/utils/config';
import logger from './src/utils/logger';

logger.info(`Server starting in ${config.NODE_ENV} environment`);

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('pinged..');
  res.send('pong');
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
