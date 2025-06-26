import { rollbackDbMigrations, sequelize } from './index';
import logger from '../utils/logger';

logger.infoAllEnvs('Rolling back SQL migrations');

rollbackDbMigrations(logger.infoAllEnvs)
  .then(_ => {
    sequelize.close()
      .then(_ => {
        logger.infoAllEnvs('All done, exiting');
      })
      .catch((error: unknown) => {
        let errorMsg = 'Error closing sequelize DB connection';
        if (error instanceof Error) {
          errorMsg += `: ${error.message}`;
        } else {
          errorMsg += `: ${JSON.stringify(error)}`;
        }
        logger.errorAllEnvs(errorMsg);
      });
  })
  .catch(error => {
    let errorMsg = 'Error rolling back SQL migrations';
    if (error instanceof Error) {
      errorMsg += `: ${error.message}`;
    } else {
      errorMsg += `: ${JSON.stringify(error)}`;
    }
    logger.errorAllEnvs(errorMsg);
  });
