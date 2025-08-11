import supertest from 'supertest';

import { authTestSuite } from './authSuite';
import { raceTestSuite } from './raceSuite';
import { userTestSuite } from './userSuite';

import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';

import app from '../../src/app';

const api = supertest(app);

describe('API routes', () => {
  beforeAll(async () => {
    await testFirebase.connectToFirebase();
    await testDatabase.connectToDatabase(console.info);
  });

  afterAll(async () => {
    await testDatabase.disconnectFromDatabase();
  });

  // Test suites are run in sequential order

  authTestSuite(api);
  raceTestSuite(api);
  userTestSuite(api);
});
