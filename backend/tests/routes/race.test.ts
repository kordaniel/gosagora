import supertest from 'supertest';

import { generateRandomString } from '../testUtils/testHelpers';
import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';
import userUtils from '../testUtils/userUtils';

import app from '../../src/app';

const api = supertest(app);

describe('/race', () => {
  const baseUrl = '/api/v1/race';

  beforeAll(async () => {
    await testFirebase.connectToFirebase();
    await testDatabase.connectToDatabase();
    await testFirebase.dropUsers();
    await testDatabase.dropUsers();
  });

  afterAll(async () => {
    await testDatabase.disconnectFromDatabase();
  });

  describe('When no races exist', () => {
    beforeAll(async () => {
      await testDatabase.dropRaces();
    });

    describe('Addition of new races', () => {

      test('Succeeds with valid data', async () => {
        const raceData = {
          name: 'Test race 1',
          type: 'ONE_DESIGN',
          url: 'https://url.for.test_race1.com/',
          email: 'test@race1.com',
          description: 'A short description of our test race',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, createdAt, updatedAt, ...bodyRest } = res.body;

        expect(id).toEqual(expect.any(Number));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(createdAt)).not.toBeNaN();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(updatedAt)).not.toBeNaN();

        expect(bodyRest).toStrictEqual({
          userId: user.user.id,
          name: raceData.name,
          type: raceData.type,
          url: raceData.url,
          email: raceData.email,
          description: raceData.description,
          deletedAt: null
        });
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
      });

      test('Succeeds with valid data where url is null', async () => {
        const raceData = {
          name: 'Test race 2',
          type: 'ONE_DESIGN',
          url: null,
          email: 'test@race2.com',
          description: 'This race is created with a null url',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, createdAt, updatedAt, ...bodyRest } = res.body;

        expect(id).toEqual(expect.any(Number));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(createdAt)).not.toBeNaN();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(updatedAt)).not.toBeNaN();

        expect(bodyRest).toStrictEqual({
          userId: user.user.id,
          name: raceData.name,
          type: raceData.type,
          url: null,
          email: raceData.email,
          description: raceData.description,
          deletedAt: null
        });
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
      });

      test('Succeeds with valid data where email is null', async () => {
        const raceData = {
          name: 'Test race 3',
          type: 'ONE_DESIGN',
          url: 'https://url.for.test_race3.com/',
          email: null,
          description: 'This race is created with a null email',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { id, createdAt, updatedAt, ...bodyRest } = res.body;

        expect(id).toEqual(expect.any(Number));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(createdAt)).not.toBeNaN();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        expect(Date.parse(updatedAt)).not.toBeNaN();

        expect(bodyRest).toStrictEqual({
          userId: user.user.id,
          name: raceData.name,
          type: raceData.type,
          url: raceData.url,
          email: null,
          description: raceData.description,
          deletedAt: null
        });
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
      });

      test('Fails when request type is not create', async () => {
        const raceData = {
          name: 'A good race',
          type: 'ONE_DESIGN',
          url: 'https://good.race.com/',
          email: 'good@race.com',
          description: 'This object is sent as the data of a request of the wrong type',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'new',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('type._errors', [
          'Invalid literal value, expected "create"',
        ]);

        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails with no data object', async () => {
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data._errors', ['Required']);

        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails when data is empty object', async () => {
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: { },
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.name._errors', ['Required']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.type._errors', ['Required']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.url._errors', ['Required']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', ['Required']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.description._errors', ['Required']);

        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if email is not a valid email', async () => {
        const raceData = {
          name: 'Invalid email race',
          type: 'ONE_DESIGN',
          url: null,
          email: 'invalid.email.race.com',
          description: 'This object contains an invalid email address',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', ['Invalid email']);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if email is too short', async () => {
        const raceData = {
          name: 'Too short email race',
          type: 'ONE_DESIGN',
          url: null,
          email: 'a@c.com',
          description: 'This object contains an email address that is too short',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', [
          'String must contain at least 8 character(s)'
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if email is too long', async () => {
        const raceData = {
          name: 'Too long email race',
          type: 'ONE_DESIGN',
          url: null,
          email: `${generateRandomString((256-4)/2)}@${generateRandomString((256-4)/2)}.com`, // len = 257
          description: 'This object contains an email address that is too long',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.email._errors', [
          'String must contain at most 256 character(s)'
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if name is too short', async () => {
        const raceData = {
          name: 'abc',
          type: 'ONE_DESIGN',
          url: null,
          email: null,
          description: 'Description of a race with a too short name',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.name._errors', [
          'String must contain at least 4 character(s)'
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if name is too long', async () => {
        const raceData = {
          name: generateRandomString(129),
          type: 'ONE_DESIGN',
          url: null,
          email: null,
          description: 'Description of a race with a too long name',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.name._errors', [
          'String must contain at most 128 character(s)'
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if race type is empty string', async () => {
        const raceData = {
          name: 'Race where type is empty string',
          type: '',
          url: null,
          email: null,
          description: 'A short description of our race that has a type of an empty string',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.type._errors', [
          'Invalid enum value. Expected \'ONE_DESIGN\', received \'\''
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if race type is not a member of RaceType enum', async () => {
        const raceData = {
          name: 'Race with an invalid type',
          type: 'MANY_DESIGN',
          url: null,
          email: null,
          description: 'A short description of our race with an invalid type',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.type._errors', [
          'Invalid enum value. Expected \'ONE_DESIGN\', received \'MANY_DESIGN\''
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if description is too short', async () => {
        const raceData = {
          name: 'Race with a too short description',
          type: 'ONE_DESIGN',
          url: null,
          email: null,
          description: 'abc',
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.description._errors', [
          'String must contain at least 4 character(s)'
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      test('Fails if description is too long', async () => {
        const raceData = {
          name: 'Race with a too long description',
          type: 'ONE_DESIGN',
          url: null,
          email: null,
          description: generateRandomString(2001),
        };
        const user = await userUtils.createSignedInUser();
        const idToken = await user.credentials.user.getIdToken();
        const initialRaceCount = await testDatabase.raceCount();
        const res = await api
          .post(baseUrl)
          .set('Authorization', `Bearer ${idToken}`)
          .send({
            type: 'create',
            data: raceData,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.data).toBeUndefined();

        expect(res.body).toHaveProperty('error');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.error).toHaveProperty('data.description._errors', [
          'String must contain at most 2000 character(s)'
        ]);
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

    }); // Addition of new races

  }); // When no races exist

}); // '/race'
