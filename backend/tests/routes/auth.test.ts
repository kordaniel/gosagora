import supertest from 'supertest';
import type { UserCredential } from 'firebase/auth';

import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';

import app from '../../src/app';
import userUtils, { type IUserBaseObject } from '../testUtils/userUtils';
import { generateRandomString } from '../testUtils/testHelpers';

const api = supertest(app);

describe('/auth', () => {
  const baseUrl = '/api/v1/auth';

  beforeAll(async () => {
    await testFirebase.connectToFirebase();
    await testDatabase.connectToDatabase();
  });

  afterAll(async () => {
    await testDatabase.disconnectFromDatabase();
  });

  describe('When no users exist', () => {
    beforeAll(async () => {
      await testFirebase.dropUsers();
      await testDatabase.dropUsers();
    });

    describe('Addition of new users', () => {

      test('Succeeds with valid data', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email,
              password: userBase.password,
              displayName: userBase.displayName,
            },
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, firebaseUid, createdAt, updatedAt, ...bodyRest } = res.body;

        expect(id).toEqual(expect.any(Number));
        expect(typeof firebaseUid).toBe('string');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(firebaseUid.length).toBe(28);
        // The exact format of Firebase uid's is not specified, only that they are
        // strings with a length [1,128]. Currently (2025-05-08) all automatically generated
        // uid's are of length 28.

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(createdAt)).not.toBeNaN();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(updatedAt)).not.toBeNaN();

        expect(bodyRest).toEqual({
          lastseenAt: null,
          deletedAt: null,
          disabledAt: null,
          email: userBase.email.toLowerCase(),
          displayName: userBase.displayName,
        });
        expect(await testDatabase.userCount()).toEqual(initialUserCount + 1);
      });

      test('Fails when wrong request type is sent', async () => {
        const initialUserCount = await testDatabase.userCount();
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'login',
            data: {
              email: 'user@email.com',
              password: 'topsecretpasswd',
              displayName: 'H4x0r',
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).not.toBeDefined();


        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('type._errors', [
          'Invalid literal value, expected "signup"',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails with no data object', async () => {
        const initialUserCount = await testDatabase.userCount();
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).not.toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data._errors', ['Required']);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails when data is missing', async () => {
        const initialUserCount = await testDatabase.userCount();
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: { },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).not.toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', ['Required']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.password._errors', ['Required']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.displayName._errors', ['Required']);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if email is not a valid email', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email.replace('@', ''),
              password: userBase.password,
              displayName: userBase.displayName,
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', ['Invalid email']);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if email is too short', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: 'a@b.com',
              password: userBase.password,
              displayName: userBase.displayName,
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', [
          'String must contain at least 8 character(s)',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if email is too long', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const email = `${generateRandomString((256-4)/2)}@${generateRandomString((256-4)/2)}.com`; // len = 257

        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email,
              password: userBase.password,
              displayName: userBase.displayName,
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', [
          'String must contain at most 256 character(s)',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if password is too short', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;

        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email,
              password: 'abcdefg',
              displayName: userBase.displayName,
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.password._errors', [
          'String must contain at least 8 character(s)',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if password is too long', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const password = generateRandomString(31);

        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email,
              password,
              displayName: userBase.displayName,
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.password._errors', [
          'String must contain at most 30 character(s)',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if displayName is too short', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;

        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email,
              password: userBase.password,
              displayName: 'abc',
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.displayName._errors', [
          'String must contain at least 4 character(s)',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('Fails if displayName is too long', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const displayName = generateRandomString(65);

        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email,
              password: userBase.password,
              displayName,
            },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.displayName._errors', [
          'String must contain at most 64 character(s)',
        ]);
        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

    }); // Addition of new users

  }); // When no users exist

  describe('When there are users in the db', () => {
    const userCredentials: Array<{ userBase: IUserBaseObject; credentials: UserCredential; }> = [];
    const userBaseCount = 5;

    beforeAll(async () => {
      await testFirebase.dropUsers();
      await testDatabase.dropUsers();

      for (let i = 0; i < userBaseCount; i++) {
        const userBaseObj = userUtils.userBaseObjectGenerator.next().value;
        userCredentials.push({
          userBase: userBaseObj,
          credentials: await testFirebase.addNewUserEmailPassword(userBaseObj.email, userBaseObj.password),
        });
      }

      await testDatabase.insertUsers(userCredentials.map(({ userBase, credentials }) => ({
        email: userBase.email,
        displayName: userBase.displayName,
        firebaseUid: credentials.user.uid
      })));
    });

    describe('Addition of new users', () => {

      test('Succeeds with valid data', async () => {
        const initialUserCount = await testDatabase.userCount();
        const userBase = userUtils.userBaseObjectGenerator.next().value;
        const res = await api
          .post(`${baseUrl}/signup`)
          .send({
            type: 'signup',
            data: {
              email: userBase.email,
              password: userBase.password,
              displayName: userBase.displayName,
            },
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, firebaseUid, createdAt, updatedAt, ...bodyRest } = res.body;

        expect(id).toEqual(expect.any(Number));
        expect(typeof firebaseUid).toBe('string');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(firebaseUid.length).toBe(28);
        // The exact format of Firebase uid's is not specified, only that they are
        // strings with a length [1,128]. Currently (2025-05-08) all automatically generated
        // uid's are of length 28.

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(createdAt)).not.toBeNaN();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(updatedAt)).not.toBeNaN();

        expect(bodyRest).toEqual({
          lastseenAt: null,
          deletedAt: null,
          disabledAt: null,
          email: userBase.email.toLowerCase(),
          displayName: userBase.displayName,
        });
        expect(await testDatabase.userCount()).toEqual(initialUserCount + 1);
      });

      describe('Fails if unique constraints validations are not satisfied', () => {

        test('by email', async () => {
          const initialUserCount = await testDatabase.userCount();
          const userBase = userUtils.userBaseObjectGenerator.next().value;
          const email = userCredentials[0].userBase.email;

          const res = await api
            .post(`${baseUrl}/signup`)
            .send({
              type: 'signup',
              data: {
                email,
                password: userBase.password,
                displayName: userBase.displayName,
              },
            })
            .expect(409)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).not.toBeDefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toStrictEqual({
            code: 'auth/email-already-exists',
            message: 'The email address is already in use by another account.'
          });
          expect(await testDatabase.userCount()).toEqual(initialUserCount);
        });

        test('by displayName', async () => {
          const initialUserCount = await testDatabase.userCount();
          const userBase = userUtils.userBaseObjectGenerator.next().value;
          const displayName = userCredentials[0].userBase.displayName;

          const res = await api
            .post(`${baseUrl}/signup`)
            .send({
              type: 'signup',
              data: {
                email: userBase.email,
                password: userBase.password,
                displayName,
              },
            })
            .expect(409)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).not.toBeDefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toStrictEqual({
            code: 'SequelizeUniqueConstraintError',
            message: `displayName: "${displayName}" is already in use by another account`
          });
          expect(await testDatabase.userCount()).toEqual(initialUserCount);
        });

      }); // Fails if unique constraints are validated

    }); // Addition of new users

  }); // When there are users in the db

}); // '/auth'
