import config from './utils/config';
import logger from './utils/logger';
import app from './app';

logger.info(`Server starting in ${config.NODE_ENV} environment`);

const start = () => {
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
};

start();
