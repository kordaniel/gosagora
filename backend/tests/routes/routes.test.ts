import supertest from 'supertest';

import { authTestSuite } from './authSuite';
import { raceTestSuite } from './raceSuite';
import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';

import app from '../../src/app';

const api = supertest(app);

describe('API routes', () => {
  beforeAll(async () => {
    await testFirebase.connectToFirebase();
    await testDatabase.connectToDatabase();
  });

  afterAll(async () => {
    await testDatabase.disconnectFromDatabase();
  });

  // Test suites are run in sequential order

  authTestSuite(api);
  raceTestSuite(api);
});
