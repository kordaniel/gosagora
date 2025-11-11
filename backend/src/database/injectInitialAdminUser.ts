import { z } from 'zod';

import { connectToDatabase, sequelize } from './index';
import firebase, { connectToFirebase } from '../modules/firebase';
import { USER_CONSTANTS } from '../constants';
import { User } from '../models';
import authService from '../services/authService';
import config from '../utils/config';
import logger from '../utils/logger';

const EnvSchema = z.object({
  NODE_ENV: z.literal('production'),
  GOSAGORA_ADMIN_EMAIL: z.string()
    .trim()
    .toLowerCase()
    .min(USER_CONSTANTS.VALIDATION.EMAIL_LEN.MIN)
    .max(USER_CONSTANTS.VALIDATION.EMAIL_LEN.MAX)
    .email(),
  GOSAGORA_ADMIN_DISPLAYNAME: z.string()
    .trim()
    .min(USER_CONSTANTS.VALIDATION.DISPLAY_NAME_LEN.MIN)
    .max(USER_CONSTANTS.VALIDATION.DISPLAY_NAME_LEN.MAX),
  GOSAGORA_ADMIN_PASSWORD: z.string()
    .trim()
    .min(USER_CONSTANTS.VALIDATION.PASSWORD_LEN.MIN)
    .max(USER_CONSTANTS.VALIDATION.PASSWORD_LEN.MAX),
});

const parsedEnv = EnvSchema.safeParse(process.env);

logger.infoAllEnvs('Attempting to insert initial admin user for GosaGora');

if (!parsedEnv.success) {
  logger.errorAllEnvs('Could not parse admin user credentials from environment variables. Error(s):', parsedEnv.error.flatten().fieldErrors);
  process.exit(78); // EX_CONFIG: configuration error
} else {
  logger.infoAllEnvs('All required environment variables found and parsed - proceeding');
}

const run = async () => {
  if (!config.IS_PRODUCTION_ENV) {
    throw new Error('This script should only be run in production environment');
  }
  await connectToFirebase();
  if (await firebase.hasUsers()) {
    logger.infoAllEnvs('Firebase auth contains users - aborting');
    return;
  } else {
    logger.infoAllEnvs('Firebase auth contains no users - proceeding');
  }

  await connectToDatabase();
  const dbUsersCount = await User.unscoped().count({ paranoid: false });
  if (dbUsersCount !== 0) {
    logger.infoAllEnvs(`Table '${USER_CONSTANTS.SQL_TABLE_NAME}' already contains data - aborting`);
    return;
  } else {
    logger.infoAllEnvs(`Table '${USER_CONSTANTS.SQL_TABLE_NAME}' is empty - proceeding`);
  }

  await authService.createNewUser({
    email: parsedEnv.data.GOSAGORA_ADMIN_EMAIL,
    displayName: parsedEnv.data.GOSAGORA_ADMIN_DISPLAYNAME,
    password: parsedEnv.data.GOSAGORA_ADMIN_PASSWORD,
  });
  logger.infoAllEnvs('Admin user successfully created');
};

run()
  .then(_ => {
    sequelize.close()
      .then(_ => { logger.infoAllEnvs('All done - exiting'); })
      .catch((error: unknown) => {
        logger.errorAllEnvs(
          `Error closing sequelize DB connection: ${error instanceof Error ? error.message : JSON.stringify(error)} - exiting`
        );
      });
  })
  .catch((error: unknown) => {
    logger.errorAllEnvs(
      `Error: ${error instanceof Error ? error.message : JSON.stringify(error)} - exiting`
    );
    process.exit(70); // EX_SOFTWARE: internal software error
  });
