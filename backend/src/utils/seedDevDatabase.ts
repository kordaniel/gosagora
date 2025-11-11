import config from './config';
import logger from './logger';

import { MSEC_IN_DAY, getDateUTCDateOnlyOffsetDaysFromNow } from './dateTools';
import { RACE_CONSTANTS, SAILBOAT_CONSTANTS, USER_CONSTANTS } from '../constants';
import { Race, Sailboat, User } from '../models';

import authService from '../services/authService';
import boatService from '../services/boatService';
import raceService from '../services/raceService';

import type { NewRaceAttributes } from '../types';
import firebase from '../modules/firebase';

import type {
  CreateSailboatArguments,
  SignUpArguments,
} from '@common/types/rest_api';
import { BoatType } from '@common/types/boat';
import { RaceType } from '@common/types/race';

const UTC_DATE_NOW = getDateUTCDateOnlyOffsetDaysFromNow(0);

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
}] as const;

const RACES_SEED_DATA: Record<string, NewRaceAttributes[]> = {
  'dev1@tester.com': [
    {
      name: 'Dev 1 Race 1',
      type: RaceType.OneDesign,
      public: true,
      url: 'https://www.dev1.users.first.gosagora.race/',
      email: 'dev1.race1@tester.gosagora.com',
      description: 'The first dev race of user Dev1',
      dateFrom: new Date(UTC_DATE_NOW.getTime() + MSEC_IN_DAY),
      dateTo: new Date(Date.UTC(
        UTC_DATE_NOW.getUTCFullYear(), UTC_DATE_NOW.getUTCMonth(), UTC_DATE_NOW.getUTCDate(),
        23, 59, 59, 999
      ) + 2 * MSEC_IN_DAY),
      registrationOpenDate: UTC_DATE_NOW,
      registrationCloseDate: new Date(Date.UTC(
        UTC_DATE_NOW.getUTCFullYear(), UTC_DATE_NOW.getUTCMonth(), UTC_DATE_NOW.getUTCDate(),
        23, 59, 59, 999
      ) + MSEC_IN_DAY),
    },
    {
      name: 'Dev 1 Race 2',
      type: RaceType.OneDesign,
      public: true,
      url: null,
      email: null,
      description: 'The second dev race of user Dev1',
      dateFrom: new Date(UTC_DATE_NOW.getTime() + 10 * MSEC_IN_DAY),
      dateTo: new Date(Date.UTC(
        UTC_DATE_NOW.getUTCFullYear(), UTC_DATE_NOW.getUTCMonth(), UTC_DATE_NOW.getUTCDate(),
        23, 59, 59, 999
      ) + 11 * MSEC_IN_DAY),
      registrationOpenDate: new Date(UTC_DATE_NOW.getTime() + MSEC_IN_DAY),
      registrationCloseDate: new Date(Date.UTC(
        UTC_DATE_NOW.getUTCFullYear(), UTC_DATE_NOW.getUTCMonth(), UTC_DATE_NOW.getUTCDate(),
        23, 59, 59, 999
      ) + 11 * MSEC_IN_DAY),
    },
  ],
  'dev2@tester.com': [
    {
      name: 'Dev 2 Race 1',
      type: RaceType.OneDesign,
      public: true,
      url: 'https://www.dev2.users.first.gosagora.race/',
      email: 'dev2.race1@tester.gosagora.com',
      description: 'The first dev race of user Dev2',
      dateFrom: UTC_DATE_NOW,
      dateTo: new Date(Date.UTC(
        UTC_DATE_NOW.getUTCFullYear(), UTC_DATE_NOW.getUTCMonth(), UTC_DATE_NOW.getUTCDate(),
        23, 59, 59, 999
      )),
      registrationOpenDate: UTC_DATE_NOW,
      registrationCloseDate: new Date(Date.UTC(
        UTC_DATE_NOW.getUTCFullYear(), UTC_DATE_NOW.getUTCMonth(), UTC_DATE_NOW.getUTCDate(),
        23, 59, 59, 999
      )),
    },
  ],
} as const;

const SAILBOATS_SEED_DATA: Record<string, CreateSailboatArguments[]> = {
  'dev1@tester.com': [
    {
      name: 'Dev1 boat 1',
      description: 'First testing boat for dev1@tester.com',
      sailNumber: 'DEV-1',
    },
    {
      name: 'Dev1 boat 2',
      description: 'Second testing boat for dev1@tester.com',
      sailNumber: 'FIN-1',
    },
    {
      name: 'Dev1 boat 3',
      description: null,
      sailNumber: null,
    },
  ],
  'dev3@tester.com': [
    {
      name: 'Dev3 boat 1',
      description: 'First testing boat for dev3@tester.com',
      sailNumber: 'FIN-12345',
    },
  ],
} as const;

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

const seedRaces = async () => {
  const dbRacesCount = await Race.count({ paranoid: false });
  if (dbRacesCount > 0) {
    logger.info(`Table '${RACE_CONSTANTS.SQL_TABLE_NAME}' already contains data - skipping`);
    return;
  }

  logger.info(`Table '${RACE_CONSTANTS.SQL_TABLE_NAME}' is empty - seeding default records`);

  const races = await Promise.all(Object.entries(RACES_SEED_DATA).map(async ([email, rSeeds]) => {
    const user = await User.unscoped().findOne({
      attributes: ['id'],
      paranoid: false,
      where: { email },
    });
    if (!user) {
      return undefined;
    }
    return Promise.all(rSeeds.map(r => raceService.createNewRace(user.id, r)));
  }));

  const seededRacesCnt = races.reduce((acc, cur) => !cur ? acc : acc + cur.length, 0);
  logger.info(`Inserted ${seededRacesCnt} races.`);
};

const seedSailboats = async () => {
  const dbSailboatsCount = await Sailboat.count({ paranoid: false });
  if (dbSailboatsCount > 0) {
    logger.info(`Table '${SAILBOAT_CONSTANTS.SQL_TABLE_NAME}' already contains data - skipping`);
    return;
  }

  logger.info(`Table '${SAILBOAT_CONSTANTS.SQL_TABLE_NAME}' is empty - seeding default records`);

  const sailboats = await Promise.all(Object.entries(SAILBOATS_SEED_DATA).map(async ([email, sbSeeds]) => {
    const user = await User.unscoped().findOne({
      attributes: ['id'],
      paranoid: false,
      where: { email },
    });
    if (!user) {
      return undefined;
    }
    return Promise.all(sbSeeds.map(sb => boatService.createNewBoat(user.id, BoatType.Sailboat, sb)));
  }));

  const seededSailboatsCnt = sailboats.reduce((acc, cur) => !cur ? acc : acc + cur.length, 0);
  logger.info(`Inserted ${seededSailboatsCnt} sailboats.`);
};

export const checkAndSeedDevDatabase = async (): Promise<void> => {
  if (!config.IS_DEVELOPMENT_ENV) {
    return;
  }

  logger.info('Starting dev database seed process');
  await seedUsers();
  await seedRaces();
  await seedSailboats();
  logger.info('Dev database seed process finished');
};
