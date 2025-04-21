import { Sequelize } from 'sequelize';

import configuration from '../utils/config';
import logger from '../utils/logger';
import { stripCredentialsFromDBUri } from '../utils/helpers';

const db_uri = 'BLANK';

logger.info(`Connecting to SQL DB: ${stripCredentialsFromDBUri(db_uri)}`);
export const sequelize = new Sequelize(db_uri, {
  dialectOptions: {
    ssl: configuration.IS_PRODUCTION_ENV ? { require: true, rejectUnauthorized: false, } : null,
  },
  pool: {
    min: 0,
    max: 3,
    idle: 45000,
    acquire: 60000,
  },
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`Connection to SQL DB at ${stripCredentialsFromDBUri(db_uri)} has been established successfully`);
  } catch (error: unknown) {
    let errorMsg = 'Error connecting to Postgres DB';
    if (error instanceof Error) {
      errorMsg += `: ${error.message}`;
    }
    logger.error(errorMsg);
    process.exit(1);
  }
};
