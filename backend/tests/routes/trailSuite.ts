import TestAgent from 'supertest/lib/agent';
import { type UserCredential } from 'firebase/auth';

import {
  Sailboat,
  Trail,
  User,
  UserSailboats,
} from '../../src/models';
import {
  generateRandomInteger,
  generateRandomString
} from '../testUtils/testHelpers';
import boatUtils from '../testUtils/boatUtils';
import testDatabase from '../testUtils/testDatabase';
import trailUtils from '../testUtils/trailUtils';
import userUtils from '../testUtils/userUtils';

export const trailTestSuite = (api: TestAgent) => describe('/trail', () => {
  const baseUrl = '/api/v1/trail';

  describe('When no trails exist', () => {

    describe('Listing trails', () => {

      test('return empty array', async () => {
        const res = await api
          .get(baseUrl)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toHaveLength(0);
      });

    }); // Listing trails

    describe('Addition of new trails', () => {

      describe('Succeeds', () => {

        test('with valid data', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'Test Trail 1',
            description: 'The first trail created by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
            })
            .expect(201)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { id, startDate, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          expect(Date.parse(startDate)).not.toBeNaN();

          expect(rest).toStrictEqual({
            name: trailData.name,
            endDate: null,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            },
            boat: {
              id: boat.sailboat.id,
              name: boat.sailboat.name,
              boatType: boat.sailboat.boatType,
            },
          });
          expect(await testDatabase.trailCount()).toEqual(initialTrailCount + 1);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const trailInDb = await testDatabase.getTrailByPk(id);
          expect(trailInDb?.public).toBe(true);
        });

        test('creates a public trail when data does not contain field public', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            name: 'Test Trail 3',
            description: 'The third trail created by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
            })
            .expect(201)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { id, startDate, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          expect(Date.parse(startDate)).not.toBeNaN();

          expect(rest).toStrictEqual({
            name: trailData.name,
            endDate: null,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            },
            boat: {
              id: boat.sailboat.id,
              name: boat.sailboat.name,
              boatType: boat.sailboat.boatType,
            },
          });
          expect(await testDatabase.trailCount()).toEqual(initialTrailCount + 1);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const trailInDb = await testDatabase.getTrailByPk(id);
          expect(trailInDb?.public).toBe(true);
        });

        test('with valid data where public is false', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: false,
            name: 'Test Trail 2',
            description: 'The second trail created by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
            })
            .expect(201)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { id, startDate, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          expect(Date.parse(startDate)).not.toBeNaN();

          expect(rest).toStrictEqual({
            name: trailData.name,
            endDate: null,
            user: {
              id: user.user.id,
              displayName: user.user.displayName,
            },
            boat: {
              id: boat.sailboat.id,
              name: boat.sailboat.name,
              boatType: boat.sailboat.boatType,
            },
          });
          expect(await testDatabase.trailCount()).toEqual(initialTrailCount + 1);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const trailInDb = await testDatabase.getTrailByPk(id);
          expect(trailInDb?.public).toBe(false);
        });

      }); // Succeeds

      describe('Fails', () => {

        test('when request type is not create', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'Failed Test Trail 1',
            description: 'First failed test trail',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'new',
              data: trailData,
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

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('with no data object', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();

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

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('when data is empty object', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();

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
          expect(res.body.error).toHaveProperty('data.sailboatId._errors', ['Required']);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.name._errors', ['Required']);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('data.description._errors', ['Required']);

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('with status 403 if passed sailboatId does not exist in the DB', async () => {
          const user = await userUtils.createSignedInUser();
          let nonExistingSailboatId: number = generateRandomInteger();
          while ((await testDatabase.getTrailByPk(nonExistingSailboatId)) !== null) {
            nonExistingSailboatId = generateRandomInteger();
          }
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: nonExistingSailboatId,
            public: true,
            name: 'A test trail with a non existing sailboat',
            description: 'Failed trail by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
            })
            .expect(403)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 403,
            error: {
              message: `Forbidden: You are not an owner of the specified boat with ID: '${nonExistingSailboatId}'`,
            }
          });

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('with status 403 if the user is not in the set of userSailboat relations', async () => {
          const user = await userUtils.createSignedInUser();
          const anotherUser = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(anotherUser.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'A failed test trail',
            description: 'A failed test trail by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
            })
            .expect(403)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 403,
            error: {
              message: `Forbidden: You are not an owner of the specified boat with ID: '${boat.sailboat.id}'`,
            }
          });

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('if name is too short', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'abc',
            description: 'Failed trail by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
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

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('if name is too long', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: generateRandomString(129),
            description: 'Failed trail by the tests',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
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

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('if description is too short', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'A failed trail by the tests',
            description: 'abc',
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
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

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('if description is too long', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const idToken = await user.credentials.user.getIdToken();
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'A failed trail by the tests',
            description: generateRandomString(2001),
          };

          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: trailData,
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

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

        test('without authorization', async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          const initialTrailCount = await testDatabase.trailCount();
          const trailData = {
            sailboatId: boat.sailboat.id,
            public: true,
            name: 'Unauthorized test users trail',
            description: 'Is a test trail that will never exist',
          };

          const res = await api
            .post(baseUrl)
            .send({
              type: 'create',
              data: trailData,
            })
            .expect(401)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.data).toBeUndefined();

          expect(res.body).toHaveProperty('error');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.error).toHaveProperty('message', 'Unauthorized');

          expect(await testDatabase.trailCount()).toEqual(initialTrailCount);
        });

      }); // Fails

    }); // Addition of new trails

  }); // When no trails exist

  describe('When trails exist', () => {
    let trailsInDb: Array<{
      trail: Trail;
      user: User;
      userCredentials: UserCredential;
      boat: { sailboat: Sailboat; userSailboats: UserSailboats | undefined };
    }> | undefined = undefined;

    beforeAll(async () => {
      await testDatabase.dropTrails();
      trailsInDb = await trailUtils.createTrails();
    });

    describe('Listing trails', () => {

      test('returns all races', async () => {
        if (!trailsInDb) {
          throw new Error('Internal test error: No trails in DB');
        }

        const expected = trailsInDb.map(({
          trail: { id, name, createdAt, endedAt },
          user,
          boat,
        }) => ({
          id, name,
          startDate: createdAt.toISOString(),
          endDate: endedAt === null ? null : endedAt.toISOString(),
          user: {
            id: user.id,
            displayName: user.displayName,
          },
          boat: {
            id: boat.sailboat.id,
            boatType: boat.sailboat.boatType,
            name: boat.sailboat.name,
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

    }); // Listing trails

  }); // When trails exist

}); // '/trail'
