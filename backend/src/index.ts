import config from './utils/config';
import logger from './utils/logger';

logger.info(`Server starting in ${config.NODE_ENV} environment`);

import app from './app';

import { connectToFirebase } from './modules/firebase';
import { connectToDatabase } from './database';

const start = async () => {
  await connectToFirebase();
  await connectToDatabase();

  app.listen(config.PORT, () => {
    logger.info(`REST Server running on port ${config.PORT}`);
  });
};

void start();
