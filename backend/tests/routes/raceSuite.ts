import TestAgent from 'supertest/lib/agent';
import { type UserCredential } from 'firebase/auth';

import {
  generateRandomInteger,
  generateRandomString,
  shuffleString,
} from '../testUtils/testHelpers';
import raceUtils from '../testUtils/raceUtils';
import testDatabase from '../testUtils/testDatabase';
import testFirebase from '../testUtils/testFirebase';
import userUtils from '../testUtils/userUtils';

import { Race, User } from '../../src/models';
import {
  getDateOffsetDaysFromNow,
  getUTCYearLastDateOffsetYearsFromNow
} from '../../src/utils/dateTools';

import { RaceType } from '@common/types/race';

export const raceTestSuite = (api: TestAgent) => describe('/race', () => {
  const baseUrl = '/api/v1/race';

  beforeAll(async () => {
    await testFirebase.dropUsers();
    await testDatabase.dropUsers();
  });

  describe('When no races exist', () => {
    beforeAll(async () => {
      await testDatabase.dropRaces();
    });

    describe('Listing races', () => {

      test('returns empty array', async () => {
        const res = await api
          .get(baseUrl)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toHaveLength(0);
      });

    }); // Listing races

    describe('Addition of new races', () => {

      describe('Succeeds', () => {

        test('with valid data', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
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
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
        });

        test('with valid data where url is null', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.url = null;
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
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
        });

        test('with valid data where email is null', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.email = null;
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
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
        });

        test('With valid data without field public', async () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { public: isPublic, ...raceData } = raceUtils.getRaceCreationArgumentsObject();
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
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          const raceInDb = await testDatabase.getRaceByPk(res.body.id);
          expect(raceInDb?.public).toBe(true);
        });

      }); // Succeeds

      describe('Fails', () => {

        test('when request type is not create', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
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

        test('with no data object', async () => {
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

        test('when data is empty object', async () => {
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateFrom._errors', ['Required']);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateTo._errors', ['Required']);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.registrationOpenDate._errors', ['Required']);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.registrationCloseDate._errors', ['Required']);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if email is not a valid email', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.email = 'invalid.email.race.com';
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

        test('if email is too short', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.email = 'a@c.com';
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

        test('if email is too long', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.email = `${generateRandomString((256-4)/2)}@${generateRandomString((256-4)/2)}.com`; // len = 257
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

        test('if name is too short', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.name = 'abc';
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

        test('if name is too long', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.name = generateRandomString(129);
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

        test('if race type is empty string', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.type = '' as unknown as RaceType;
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

        test('if race type is not a member of RaceType enum', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.type = 'MANY_DESIGN' as unknown as RaceType;
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

        test('if description is too short', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.description = 'abc';
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

        test('if description is too long', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.description = generateRandomString(2001);
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

        test('if public is integer 0', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: {
                ...raceUtils.getRaceCreationArgumentsObject(),
                public: 0
              },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.public._errors', [
            'Expected boolean, received number'
          ]);
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if public is integer 1', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: {
                ...raceUtils.getRaceCreationArgumentsObject(),
                public: 1
              },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.public._errors', [
            'Expected boolean, received number'
          ]);
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if public is the falsy empty string', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: {
                ...raceUtils.getRaceCreationArgumentsObject(),
                public: ''
              },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.public._errors', [
            'Expected boolean, received string'
          ]);
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if dateFrom is a date preceding yesterday', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: {
                ...raceUtils.getRaceCreationArgumentsObject(),
                dateFrom: getDateOffsetDaysFromNow(-2).toISOString(),
              },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateFrom._errors', [
            'Starting date can not be in the past'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if dateTo is a date later than the last date of next year', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: {
                ...raceUtils.getRaceCreationArgumentsObject(),
                dateTo: new Date(getUTCYearLastDateOffsetYearsFromNow(1).getTime() + 1).toISOString(),
              },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateTo._errors', [
            `The end date has to be a date before Jan, 1 ${getUTCYearLastDateOffsetYearsFromNow(2).getUTCFullYear()} (UTC)`
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if dateTo is preceding dateFrom', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.dateFrom = new Date(new Date(raceData.dateTo).getTime() + 1).toISOString();
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
          expect(res.body.error).toHaveProperty('data.dateTo._errors', [
            'End date cannot be before start date'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if registrationOpenDate is a date preceding yesterday', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: {
                ...raceUtils.getRaceCreationArgumentsObject(),
                registrationOpenDate: getDateOffsetDaysFromNow(-2).toISOString(),
              },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.registrationOpenDate._errors', [
            'Registration starting date can not be in the past'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if registrationOpenDate is a date later than registrationCloseDate', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.registrationOpenDate = new Date(new Date(raceData.registrationCloseDate).getTime() + 1).toISOString();
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
          expect(res.body.error).toHaveProperty('data.registrationCloseDate._errors', [
            'Registration close date cannot be before registration open date'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if registrationCloseDate is a date later than dateTo', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.registrationCloseDate = new Date(new Date(raceData.dateTo).getTime() + 1).toISOString();
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
          expect(res.body.error).toHaveProperty('data.registrationCloseDate._errors', [
            'Registration close date cannot be after race ending date'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if dateFrom and dateTo are not valid JsISO UTC strings', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.dateFrom = raceData.dateFrom.substring(0, raceData.dateFrom.length-1);
          raceData.dateTo = raceData.dateTo.substring(0, raceData.dateTo.length-1);
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
          expect(res.body.error).toHaveProperty('data.dateFrom._errors', [
            'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
          ]);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateTo._errors', [
            'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if dateFrom and dateTo does not include timestamp', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.dateFrom = raceData.dateFrom.substring(0, 10); // YYYY-MM-DD
          raceData.dateTo = raceData.dateTo.substring(0, 10); // YYYY-MM-DD
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
          expect(res.body.error).toHaveProperty('data.dateFrom._errors', [
            'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
          ]);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateTo._errors', [
            'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if dateFrom and dateTo are integers holding milliseconds (Unix time)', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.dateFrom = new Date(raceData.dateFrom).getTime() as unknown as string;
          raceData.dateTo = new Date(raceData.dateTo).getTime() as unknown as string;
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
          expect(res.body.error).toHaveProperty('data.dateFrom._errors', [
            'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
          ]);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.dateTo._errors', [
            'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
          ]);

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('without authorization', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .send({
              type: 'create',
              data: raceData,
            })
            .expect(401)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message', 'Unauthorized');
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if firebase authorization token is invalid', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${shuffleString(idToken)}`)
            .send({
              type: 'create',
              data: raceData,
            })
            .expect(403)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message', 'Invalid credentials');
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('if firebase authorization token is valid but user is missing from local db', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.name = 'Invalid user race';
          raceData.description = 'User missing from local db created race';
          const userBase = userUtils.userBaseObjectGenerator.next().value;
          const credentials = await testFirebase.addNewUserEmailPassword(userBase.email, userBase.password);
          const idToken = await credentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: raceData,
            })
            .expect(403)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message', 'Forbidden: invalid user');
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

      }); // Fails

    }); // Addition of new races

  }); // When no races exist

  describe('When races exist', () => {
    let racesInDb: Array<{
      race: Race;
      user: User;
      userCredentials: UserCredential;
    }> | undefined = undefined;

    beforeAll(async () => {
      await testDatabase.dropRaces();
      racesInDb = await raceUtils.createRaces();
    });

    describe('Listing races', () => {

      test('returns all races', async () => {
        if (!racesInDb) {
          throw new Error('Internal test error: No races in DB');
        }

        const expected = racesInDb.map(({
          race: { id, name, type, description, createdAt, updatedAt },
          user
        }) => ({
          id, name, type, description,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          user: {
            id: user.id,
            displayName: user.displayName
          }
        }));

        const res = await api
          .get(baseUrl)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toHaveLength(expected.length);
        expect(res.body).toEqual(expect.arrayContaining(expected));
      });

    }); // Listing races

    describe('Deleting races', () => {
      let raceToBeDeleted: {
        race: Race;
        user: User;
        userCredentials: UserCredential;
      } | undefined = undefined;

      beforeEach(async () => {
        raceToBeDeleted = await raceUtils.createRace();
      });

      test('Responds with status 204 when authorized user attempts to delete a non existing race', async () => {
        if (!raceToBeDeleted) {
          throw new Error('Internal test error: No races in DB');
        }

        const idToken = await raceToBeDeleted.userCredentials.user.getIdToken();
        let nonExistingRaceId: number = generateRandomInteger();
        while ((await testDatabase.getRaceByPk(nonExistingRaceId)) !== null) {
          nonExistingRaceId = generateRandomInteger();
        }

        const initialRaceCount = await testDatabase.raceCount();

        const res = await api
          .delete(`${baseUrl}/${nonExistingRaceId}`)
          .set('Authorization', `Bearer ${idToken}`)
          .expect(204);

        expect(res.body).toStrictEqual({});
        expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
      });

      describe('Succeeeds', () => {

        test('when authorized user deletes her own race', async () => {
          if (!raceToBeDeleted) {
            throw new Error('Internal test error: No races in DB');
          }

          const idToken = await raceToBeDeleted.userCredentials.user.getIdToken();
          const raceInDbInitial = await testDatabase.getRaceByPk(raceToBeDeleted.race.id, true);
          const initialRaceCount = await testDatabase.raceCount();

          expect(raceInDbInitial?.deletedAt).toBeNull();

          const res = await api
            .delete(`${baseUrl}/${raceToBeDeleted.race.id}`)
            .set('Authorization', `Bearer ${idToken}`)
            .expect(204);

          expect(res.body).toStrictEqual({});

          const raceInDbFinal = await testDatabase.getRaceByPk(raceToBeDeleted.race.id, false);
          expect(raceInDbFinal?.deletedAt).not.toBeNull();
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount - 1);
        });

      }); // Succeeds

      describe('Fails', () => {

        test('without authorization', async () => {
          if (!raceToBeDeleted) {
            throw new Error('Internal test error: No races in DB');
          }

          const raceInDbInitial = await testDatabase.getRaceByPk(raceToBeDeleted.race.id, true);
          const initialRaceCount = await testDatabase.raceCount();

          expect(raceInDbInitial?.deletedAt).toBeNull();

          const res = await api
            .delete(`${baseUrl}/${raceToBeDeleted.race.id}`)
            .expect(401)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message', 'Unauthorized');

          const raceInDbFinal = await testDatabase.getRaceByPk(raceToBeDeleted.race.id, false);
          expect(raceInDbFinal?.deletedAt).toBeNull();
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('when authorized user does not own the race', async () => {
          if (!raceToBeDeleted) {
            throw new Error('Internal test error: No races in DB');
          }

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const raceInDbInitial = await testDatabase.getRaceByPk(raceToBeDeleted.race.id, true);
          const initialRaceCount = await testDatabase.raceCount();

          expect(raceInDbInitial?.deletedAt).toBeNull();

          const res = await api
            .delete(`${baseUrl}/${raceToBeDeleted.race.id}`)
            .set('Authorization', `Bearer ${idToken}`)
            .expect(403);

          expect(res.body).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message',
            'Forbidden: You dont have the required credentials to delete this race'
          );

          const raceInDbFinal = await testDatabase.getRaceByPk(raceToBeDeleted.race.id, false);
          expect(raceInDbFinal?.deletedAt).toBeNull();
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

      }); // Fails

    }); // Deleting races

  }); // When races exist

}); // '/race'
