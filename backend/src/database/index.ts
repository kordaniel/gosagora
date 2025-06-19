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
  logging: (msg) => logger.info(msg),
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

const runMigrations = async (
  loggerFn: (...data: unknown[]) => void
) => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  loggerFn('All SQL migrations are up to date', {
    files: migrations.map(mig => mig.name),
  });
};

export const rollbackDbMigrations = async (
  loggerFn: (...data: unknown[]) => void
) => {
  await sequelize.authenticate();
  loggerFn(`Connection to SQL DB at ${stripCredentialsFromDBUri(db_uri)} has been established successfully`);
  loggerFn('Attempting SQL rollback');
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.down();
  loggerFn('Rolled back SQL migrations', {
    files: migrations.map(mig => mig.name),
  });
};

export const connectToDatabase = async (
  loggerFn: (...data: unknown[]) => void = logger.info
) => {
  try {
    await sequelize.authenticate();
    await runMigrations(loggerFn);
    loggerFn(`Connection to SQL DB at ${stripCredentialsFromDBUri(db_uri)} has been established successfully`);
  } catch (error: unknown) {
    let errorMsg = 'Error connecting to Postgres DB';
    if (error instanceof Error) {
      errorMsg += `: ${error.message}`;
    }
    logger.errorAllEnvs(errorMsg);
    process.exit(69); // EX_UNAVAILABLE: service unavailable
  }
};
