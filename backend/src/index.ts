import config from './utils/config';
import logger from './utils/logger';

logger.info(`Server starting in ${config.NODE_ENV} environment`);

import app from './app';

import { checkAndSeedDevDatabase } from './utils/seedDevDatabase';
import { connectToDatabase } from './database';
import { connectToFirebase } from './modules/firebase';

const start = async () => {
  await connectToFirebase();
  await connectToDatabase();

  await checkAndSeedDevDatabase();

  app.listen(config.PORT, () => {
    logger.info(`REST Server running on port ${config.PORT}`);
  });
};

void start();
