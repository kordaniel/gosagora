import supertest from 'supertest';
import type { UserCredential } from 'firebase/auth';

import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';

import app from '../../src/app';
import userUtils from '../testUtils/userUtils';

const api = supertest(app);

describe('/auth', () => {
  const baseUrl = '/api/v1/auth';
  const userCredentials: UserCredential[] = [];

  beforeAll(async () => {
    await testFirebase.connectToFirebase();
    await testDatabase.connectToDatabase();

    await testFirebase.dropUsers();
    await testDatabase.dropUsers();

    for (let i = 0; i < 1; i++) {
      const constructedUserBase = userUtils.userBaseObjectGenerator.next().value;
      if (constructedUserBase.index !== userCredentials.length) {
        throw new Error('User base objects / authorized user credentials out of sync');
      }

      const userBaseObj = constructedUserBase.userBaseObject;
      userCredentials.push(await testFirebase.addNewUserEmailPassword(userBaseObj.email, userBaseObj.password));
    }
  });

  afterAll(async () => {
    await testDatabase.disconnectFromDatabase();
  });

  describe('When no users exist', () => {

    describe('Addition of new users', () => {

      test('Succeeds with valid data', async () => {
        const userBase = userUtils.userBaseObjects[0];
        const credentials = userCredentials[0];
        const idToken = await credentials.user.getIdToken();

        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: credentials.user.email,
              displayName: userBase.displayName,
              firebaseUid: credentials.user.uid,
              firebaseIdToken: idToken,
            },
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, createdAt, updatedAt, ...bodyRest } = res.body;
        expect(id).toEqual(expect.any(Number));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(isNaN(Date.parse(createdAt))).toBe(false);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(isNaN(Date.parse(updatedAt))).toBe(false);

        expect(bodyRest).toEqual({
          lastseenAt: null,
          deletedAt: null,
          disabledAt: null,
          email: userBase.email.toLowerCase(),
          displayName: userBase.displayName,
          firebaseUid: credentials.user.uid,
        });
      });

    }); // Addition of new users

  }); // When no users exist

}); // '/auth'
