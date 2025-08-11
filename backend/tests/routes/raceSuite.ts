import TestAgent from 'supertest/lib/agent';
import { type UserCredential } from 'firebase/auth';

import {
  generateRandomInteger,
  generateRandomString,
  getTimeSpanInMsec,
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
          const utcDateStrToDateOnly = (org: string) => `${org.split('T')[0]}T00:00:00.000Z`;
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
          const { id, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));

          expect(rest).toStrictEqual({
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            dateFrom: utcDateStrToDateOnly(raceData.dateFrom),
            dateTo: utcDateStrToDateOnly(raceData.dateTo),
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
        });

        test('with valid data where url is null', async () => {
          const utcDateStrToDateOnly = (org: string) => `${org.split('T')[0]}T00:00:00.000Z`;
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
          const { id, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));

          expect(rest).toStrictEqual({
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            dateFrom: utcDateStrToDateOnly(raceData.dateFrom),
            dateTo: utcDateStrToDateOnly(raceData.dateTo),
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
        });

        test('with valid data where email is null', async () => {
          const utcDateStrToDateOnly = (org: string) => `${org.split('T')[0]}T00:00:00.000Z`;
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
          const { id, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));

          expect(rest).toStrictEqual({
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            dateFrom: utcDateStrToDateOnly(raceData.dateFrom),
            dateTo: utcDateStrToDateOnly(raceData.dateTo),
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            }
          });
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount + 1);
        });

        test('With valid data without field public', async () => {
          const utcDateStrToDateOnly = (org: string) => `${org.split('T')[0]}T00:00:00.000Z`;
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
          const { id, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));

          expect(rest).toStrictEqual({
            name: raceData.name,
            type: raceData.type,
            description: raceData.description,
            dateFrom: utcDateStrToDateOnly(raceData.dateFrom),
            dateTo: utcDateStrToDateOnly(raceData.dateTo),
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

        test('if registrationOpenDate is a date later than dateFrom', async () => {
          const raceData = raceUtils.getRaceCreationArgumentsObject();
          raceData.registrationOpenDate = new Date(new Date(raceData.dateFrom).getTime() + 1).toISOString();
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
          expect(res.body.error).toHaveProperty('data.registrationOpenDate._errors', [
            'Registration open date cannot be after race starting date'
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

        const utcDateStrToDateOnly = (org: string) => `${org.split('T')[0]}T00:00:00.000Z`;

        const expected = racesInDb.map(({
          race: { id, name, type, description, dateFrom, dateTo },
          user
        }) => ({
          id, name, type, description,
          dateFrom: utcDateStrToDateOnly(dateFrom as unknown as string),
          dateTo: utcDateStrToDateOnly(dateTo as unknown as string),
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

    describe('Fetching single race', () => {

      test('succeeds when fetching by id', async () => {
        if (!racesInDb) {
          throw new Error('Internal test error: No races in DB');
        }

        const fromUtcStrToISOStr = (utcDateStr: string): string => {
          const [year, month, date] = utcDateStr.split('-').map(Number);
          return new Date(Date.UTC(year, month - 1, date)).toISOString();
        };

        const selectedRace = racesInDb[1];

        const expected = {
          id: selectedRace.race.id,
          public: selectedRace.race.public,
          name: selectedRace.race.name,
          type: selectedRace.race.type,
          url: selectedRace.race.url,
          email: selectedRace.race.email,
          description: selectedRace.race.description,
          dateFrom: fromUtcStrToISOStr(selectedRace.race.dateFrom as unknown as string),
          dateTo: fromUtcStrToISOStr(selectedRace.race.dateTo as unknown as string),
          registrationOpenDate: selectedRace.race.registrationOpenDate.toISOString(),
          registrationCloseDate: selectedRace.race.registrationCloseDate.toISOString(),
          user: {
            id: selectedRace.user.id,
            displayName: selectedRace.user.displayName,
          },
        };

        const res = await api
          .get(`${baseUrl}/${selectedRace.race.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toStrictEqual(expected);
      });

      test('succeeds when fetching by id where race creator has been deleted', async () => {
        const fromUtcStrToISOStr = (utcDateStr: string): string => {
          const [year, month, date] = utcDateStr.split('-').map(Number);
          return new Date(Date.UTC(year, month - 1, date)).toISOString();
        };

        const raceInDb = await raceUtils.createRace({ public: true });
        const idToken = await raceInDb.userCredentials.user.getIdToken();
        const expected = {
          id: raceInDb.race.id,
          public: raceInDb.race.public,
          name: raceInDb.race.name,
          type: raceInDb.race.type,
          url: raceInDb.race.url,
          email: raceInDb.race.email,
          description: raceInDb.race.description,
          dateFrom: fromUtcStrToISOStr(raceInDb.race.dateFrom as unknown as string),
          dateTo: fromUtcStrToISOStr(raceInDb.race.dateTo as unknown as string),
          registrationOpenDate: raceInDb.race.registrationOpenDate.toISOString(),
          registrationCloseDate: raceInDb.race.registrationCloseDate.toISOString(),
          user: {
            id: raceInDb.user.id,
            displayName: raceInDb.user.displayName,
          },
        };

        await api // TODO: delete user directly from DB
          .delete(`/api/v1/user/${raceInDb.user.id}`)
          .set('Authorization', `Bearer ${idToken}`)
          .expect(204);

        const res = await api
          .get(`${baseUrl}/${raceInDb.race.id}`)
          .expect(200);

        expect(res.body).toStrictEqual(expected);
      });

      test('fails with status 404 for non existing ID', async () => {
        let nonExistingRaceId: number = generateRandomInteger();
        while ((await testDatabase.getRaceByPk(nonExistingRaceId)) !== null) {
          nonExistingRaceId = generateRandomInteger();
        }

        const res = await api
          .get(`${baseUrl}/${nonExistingRaceId}`)
          .expect(404)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toStrictEqual({
          status: 404,
          error: {
            message: `Race with ID ${nonExistingRaceId} not found`,
          },
        });
      });

      test('fails with status 400 for malformed ID', async () => {
        if (!racesInDb) {
          throw new Error('Internal test error: No races in DB');
        }

        const selectedRace = racesInDb[1];
        const malformedId = `a${selectedRace.race.id}`;

        const res = await api
          .get(`${baseUrl}/${malformedId}`)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toStrictEqual({
          status: 400,
          error: {
            message: `Invalid ID for race: '${malformedId}'`
          }
        });
      });

    }); // Fetching single race

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

          if (raceInDbInitial === null) {
            throw new Error('Internal test error: raceInDbInitial should not be null');
          }
          expect(raceInDbInitial.deletedAt).toBeNull();

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

          if (raceInDbInitial === null) {
            throw new Error('Internal test error: raceInDbInitial should not be null');
          }
          expect(raceInDbInitial.deletedAt).toBeNull();

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
          if (raceInDbFinal === null) {
            throw new Error('Internal test error: raceInDbFinal should not be null');
          }
          expect(raceInDbFinal.deletedAt).toBeNull();
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

          if (raceInDbInitial === null) {
            throw new Error('Internal test error: raceInDbInitial should not be null');
          }
          expect(raceInDbInitial.deletedAt).toBeNull();

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

          if (raceInDbFinal === null) {
            throw new Error('Internal test error: raceInDbFinal should not be null');
          }
          expect(raceInDbFinal.deletedAt).toBeNull();
          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

        test('when id is not an integer', async () => {
          if (!raceToBeDeleted) {
            throw new Error('Internal test error: No races in DB');
          }

          const raceId = generateRandomString(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
          const idToken = await raceToBeDeleted.userCredentials.user.getIdToken();
          const initialRaceCount = await testDatabase.raceCount();

          const res = await api
            .delete(`${baseUrl}/${raceId}`)
            .set('Authorization', `Bearer ${idToken}`)
            .expect(400);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message',
            `Invalid ID for race: '${raceId}'`
          );

          expect(await testDatabase.raceCount()).toEqual(initialRaceCount);
        });

      }); // Fails

    }); // Deleting races

    describe('Updating races', () => {

      let raceToBeUpdated: {
        race: Race;
        user: User;
        userCredentials: UserCredential;
      } | undefined = undefined;

      beforeEach(async () => {
        raceToBeUpdated = await raceUtils.createRace();
      });

      describe('Succeeds', () => {

        describe('when authorized user', () => {

          test('updates her own race name', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceName = 'Updated racE';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  name: updatedRaceName,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            const expectedUserResponse = {
              id: raceToBeUpdated.user.id,
              displayName: raceToBeUpdated.user.displayName,
            };

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { raceData, raceListingData } = res.body;

            const utcDateStrToDateOnly = (org: string) => `${org.split('T')[0]}T00:00:00.000Z`;
            const fromUtcStrToISOStr = (utcDateStr: string): string => {
              // TODO: Refactor away into utils module !!!!!!!!!!
              const [year, month, date] = utcDateStr.split('-').map(Number);
              return new Date(Date.UTC(year, month - 1, date)).toISOString();
            };
            expect(raceListingData).toStrictEqual({
              id: raceToBeUpdated.race.id,
              name: updatedRaceName,
              type: raceToBeUpdated.race.type,
              description: raceToBeUpdated.race.description,
              dateFrom: utcDateStrToDateOnly(raceToBeUpdated.race.dateFrom as unknown as string),
              dateTo: utcDateStrToDateOnly(raceToBeUpdated.race.dateTo as unknown as string),
              user: expectedUserResponse,
            });
            expect(raceData).toStrictEqual({
              id: raceToBeUpdated.race.id,
              public: raceToBeUpdated.race.public,
              name: updatedRaceName,
              type: raceToBeUpdated.race.type,
              url: raceToBeUpdated.race.url,
              email: raceToBeUpdated.race.email,
              description: raceToBeUpdated.race.description,
              dateFrom: fromUtcStrToISOStr(raceToBeUpdated.race.dateFrom.toString()),
              dateTo: fromUtcStrToISOStr(raceToBeUpdated.race.dateTo.toString()),
              registrationOpenDate: raceToBeUpdated.race.registrationOpenDate.toISOString(),
              registrationCloseDate: raceToBeUpdated.race.registrationCloseDate.toISOString(),
              user: expectedUserResponse,
            });
          });

          // TODO: Add tests when new race types are implemented
          //test('updates her own race type', async () => {});

          test('updates her own race public status', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  public: !raceToBeUpdated.race.public,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.public).toBe(!raceToBeUpdated.race.public);
          });

          test('updates her own race url with a proper url', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceUrl = 'https://www.gosagora.race.com';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  url: updatedRaceUrl,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.url).toBe(updatedRaceUrl);
          });

          test('updates her own race url to be null', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            expect(raceToBeUpdated.race.url).not.toBeNull();

            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  url: null,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.url).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.url).toBeNull();
          });

          test('updates her own race email with a proper email', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceEmail = 'testers.updated@gosagora.email.com';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  email: updatedRaceEmail,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.email).toBe(updatedRaceEmail);
          });

          test('updates her own race email to be null', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            expect(raceToBeUpdated.race.email).not.toBeNull();

            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  email: null,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.email).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.email).toBeNull();
          });

          test('updates her own race description', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceDescription = 'This is a short and prompt description of the updated race';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  description: updatedRaceDescription,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.description).toBe(updatedRaceDescription);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData.description).toBe(updatedRaceDescription);
          });

          test('updates her own race dateFrom and dateTo', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceDateFrom = new Date(new Date(raceToBeUpdated.race.dateFrom).getTime() + getTimeSpanInMsec(1));
            const updatedRaceDateTo = new Date(new Date(raceToBeUpdated.race.dateTo).getTime() + getTimeSpanInMsec(1));
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  dateFrom: updatedRaceDateFrom.toISOString(),
                  dateTo: updatedRaceDateTo.toISOString(),
                  registrationOpenDate:  raceToBeUpdated.race.registrationOpenDate.toISOString(),
                  registrationCloseDate: raceToBeUpdated.race.registrationCloseDate.toISOString(),
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.dateFrom).toBe(updatedRaceDateFrom.toISOString());
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.dateTo).toBe(updatedRaceDateTo.toISOString());
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData.dateFrom).toBe(updatedRaceDateFrom.toISOString());
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData.dateTo).toBe(updatedRaceDateTo.toISOString());
          });

          test('updates her own race registrationOpenDate and registrationCloseDate', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRegistrationOpenDate = new Date(raceToBeUpdated.race.registrationOpenDate.getTime() + getTimeSpanInMsec(0, -1));
            const updatedRegistrationCloseDate = new Date(raceToBeUpdated.race.registrationCloseDate.getTime() + getTimeSpanInMsec(0, 1));
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  dateFrom: new Date(raceToBeUpdated.race.dateFrom).toISOString(),
                  dateTo: new Date(raceToBeUpdated.race.dateTo).toISOString(),
                  registrationOpenDate: updatedRegistrationOpenDate.toISOString(),
                  registrationCloseDate: updatedRegistrationCloseDate.toISOString(),
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceListingData).toBeDefined();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.registrationOpenDate).toBe(updatedRegistrationOpenDate.toISOString());
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.raceData.registrationCloseDate).toBe(updatedRegistrationCloseDate.toISOString());
          });

        }); // when authorized user

      }); // Succeeds

      describe('Fails', () => {

        describe('when authorized user', () => {

          test('patch request type is not update', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceDescription = 'This is a short and prompt description of the updated race';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'patch',
                data: {
                  description: updatedRaceDescription,
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.data).toBeUndefined();

            expect(res.body).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.error).toHaveProperty('type._errors', [
              'Invalid literal value, expected "update"'
            ]);

            const raceFromDB = await testDatabase.getRaceByPk(raceToBeUpdated.race.id);
            expect(raceFromDB?.description).toBe(raceToBeUpdated.race.description);
          });

          test('patch request contains no data object', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.data).toBeUndefined();

            expect(res.body).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.error).toHaveProperty('data._errors', ['Required']);
          });

          test('patch request data is empty object', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: { },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.data).toBeUndefined();

            expect(res.body).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.error).toHaveProperty('data._errors', [
              'Patch request data object must contain data'
            ]);
          });

          test('patch request data object contains unrecognized data', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceDescription = 'This is a short and prompt description of the updated race';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  description: updatedRaceDescription,
                  invalidExtraField: true,
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.data).toBeUndefined();

            expect(res.body).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.error).toHaveProperty('data._errors', [
              'Unrecognized key(s) in object: \'invalidExtraField\''
            ]);

            const raceFromDB = await testDatabase.getRaceByPk(raceToBeUpdated.race.id);
            expect(raceFromDB?.description).toBe(raceToBeUpdated.race.description);
          });

          test('patch request data object contains only a single timestamp', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRegistrationOpenDate = new Date(raceToBeUpdated.race.registrationOpenDate.getTime() + getTimeSpanInMsec(0, -1));
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  registrationOpenDate: updatedRegistrationOpenDate.toISOString(),
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.data).toBeUndefined();

            expect(res.body).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(res.body.error).toHaveProperty('data._errors', [
              'Invalid datetime fields: either provide all or none'
            ]);

            const raceFromDB = await testDatabase.getRaceByPk(raceToBeUpdated.race.id);
            expect(raceFromDB?.registrationOpenDate).toEqual(raceToBeUpdated.race.registrationOpenDate);
          });

          test('attempts to update a non existing race, returns 404', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const updatedRaceDescription = 'This is a short and prompt description of the updated race';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();
            let nonExistingRaceId: number = generateRandomInteger();
            while ((await testDatabase.getRaceByPk(nonExistingRaceId)) !== null) {
              nonExistingRaceId = generateRandomInteger();
            }

            const res = await api
              .patch(`${baseUrl}/${nonExistingRaceId}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  description: updatedRaceDescription,
                },
              })
              .expect(404)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 404,
              error: {
                message: `Race with ID ${nonExistingRaceId} not found`
              }
            });
          });

          test('attempts to update another users race, returns 403', async () => {
            if (!raceToBeUpdated) {
              throw new Error('Internal test error: No race to be updated in DB');
            }

            const anotherUsersRace = await testDatabase.getRaceWhereUserIdIsNot(raceToBeUpdated.user.id);
            if (anotherUsersRace === null) {
              throw new Error('Internal test error: No another users race to be updated in DB');
            }

            const updatedRaceDescription = 'This is a short and prompt description of the updated race';
            const idToken = await raceToBeUpdated.userCredentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${anotherUsersRace.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  description: updatedRaceDescription,
                },
              })
              .expect(403)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 403,
              error: {
                message: 'Forbidden: You dont have the required credentials to update this race'
              },
            });
          });

        }); // when authorized user

        test('with status 401 when not authorized user attempts to update an existing race', async () => {
          if (!raceToBeUpdated) {
            throw new Error('Internal test error: No race to be updated in DB');
          }

          const updatedRaceDescription = 'This is a short and prompt description of the updated race';

          const res = await api
            .patch(`${baseUrl}/${raceToBeUpdated.race.id}`)
            .send({
              type: 'update',
              data: {
                description: updatedRaceDescription,
              },
            })
            .expect(401)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message', 'Unauthorized');
        });

      }); // Fails

    }); // Updating races

  }); // When races exist

}); // '/race'
