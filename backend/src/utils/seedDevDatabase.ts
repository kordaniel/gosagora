import config from './config';
import logger from './logger';

import { USER_CONSTANTS } from '../constants';
import { User } from '../models';
import authService from '../services/authService';
import firebase from '../modules/firebase';

import type { SignUpArguments } from '@common/types/rest_api';

const USERS_SEED_DATA: SignUpArguments[] = [{
  email: 'dev1@tester.com',
  displayName: 'Dev1Tester',
  password: 'devpassword',
}, {
  email: 'dev2@tester.com',
  displayName: 'Dev2Tester',
  password: 'devpassword',
}, {
  email: 'dev3@tester.com',
  displayName: 'Dev3Tester',
  password: 'devpassword',
}];

const seedUsers = async () => {
  const dbUsersCount = await User.unscoped().count({ paranoid: false });
  if (dbUsersCount > 0) {
    logger.info(`Table '${USER_CONSTANTS.SQL_TABLE_NAME}' already contains data - skipping`);
    return;
  }

  logger.info(`Table '${USER_CONSTANTS.SQL_TABLE_NAME}' is empty - seeding default records`);

  if (await firebase.hasUsers()) {
    logger.info('Firebase auth contains users - deleting all records');
    let fbUsers = await firebase.getAllUsers(1000);
    while (fbUsers && fbUsers.users.length > 0) {
      await firebase.deleteUsers(fbUsers.users.map(u => u.uid));
      fbUsers = await firebase.getAllUsers(1000);
    }
    logger.info('All Firebase auth records deleted');
  } else {
    logger.info('Firebase auth contains no records');
  }

  const users = await Promise.all(USERS_SEED_DATA.map(u => authService.createNewUser(u)));
  logger.info(`Inserted ${users.length} users: ${users.map(u => u.email).join(', ')}`);
};

export const checkAndSeedDevDatabase = async (): Promise<void> => {
  if (!config.IS_DEVELOPMENT_ENV) {
    return;
  }

  logger.info('Starting dev database seed process');
  await seedUsers();
  logger.info('Dev database seed process finished');
};
