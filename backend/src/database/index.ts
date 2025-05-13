import { QueryInterface, Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug  } from 'umzug';
import type { UmzugOptions } from 'umzug';

import configuration from '../utils/config';
import logger from '../utils/logger';
import { stripCredentialsFromDBUri } from '../utils/helpers';

const db_uri = configuration.DB_URI;

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

const migrationConf: UmzugOptions<QueryInterface> = {
  migrations: {
    glob: 'src/database/migrations/*.ts',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: {
    info: logger.info,
    warn: logger.infoAllEnvs,
    error: logger.infoAllEnvs,
    debug: logger.infoAllEnvs,
  },
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  logger.info('All SQL migrations are up to date', {
    files: migrations.map(mig => mig.name),
  });
};

export const rollbackDbMigrations = async () => {
  await sequelize.authenticate();
  logger.info(`Connection to SQL DB at ${stripCredentialsFromDBUri(db_uri)} has been established successfully`);
  logger.info('Attempting SQL rollback');
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.down();
  logger.info('Rolled back SQL migrations', {
    files: migrations.map(mig => mig.name),
  });
};

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info(`Connection to SQL DB at ${stripCredentialsFromDBUri(db_uri)} has been established successfully`);
  } catch (error: unknown) {
    let errorMsg = 'Error connecting to Postgres DB';
    if (error instanceof Error) {
      errorMsg += `: ${error.message}`;
    }
    logger.error(errorMsg);
    process.exit(69); // EX_UNAVAILABLE: service unavailable
  }
};
