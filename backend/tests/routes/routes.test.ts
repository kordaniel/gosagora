import supertest from 'supertest';

import { authTestSuite } from './authSuite';
import { boatTestSuite } from './boatSuite';
import { raceTestSuite } from './raceSuite';
import { trailTestSuite } from './trailSuite';
import { userTestSuite } from './userSuite';

import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';

import app from '../../src/app';

const api = supertest(app);

const clearDbRunTestSuite = (testSuite: () => void) => {
  describe('With empty DB', () => {
    beforeAll(async () => {
      await testFirebase.dropUsers();
      await testDatabase.dropTrails();
      await testDatabase.dropUserSailboats();
      await testDatabase.dropSailboats();
      await testDatabase.dropRaces();
      await testDatabase.dropUsers();
    });

    testSuite();
  });
};

describe('API routes', () => {
  beforeAll(async () => {
    await testFirebase.connectToFirebase();
    await testDatabase.connectToDatabase(console.info);
  });

  afterAll(async () => {
    await testDatabase.disconnectFromDatabase();
  });

  // Test suites are run in sequential order

  clearDbRunTestSuite(() => authTestSuite(api));
  clearDbRunTestSuite(() => boatTestSuite(api));
  clearDbRunTestSuite(() => trailTestSuite(api));
  clearDbRunTestSuite(() => raceTestSuite(api));
  clearDbRunTestSuite(() => userTestSuite(api));
});
