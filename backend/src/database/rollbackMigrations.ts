import logger from '../utils/logger';
import { rollbackDbMigrations } from './index';

logger.info('Rolling back SQL migrations');

rollbackDbMigrations()
  .then(_ => {
    logger.info('All done, exiting');
  })
  .catch(error => {
    let errorMsg = 'Error rolling back SQL migrations';
    if (error instanceof Error) {
      errorMsg += `: ${error.message}`;
    } else {
      errorMsg += `: ${JSON.stringify(error)}`;
    }
    logger.error(errorMsg);
  });
