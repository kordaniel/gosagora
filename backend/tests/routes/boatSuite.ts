import TestAgent from 'supertest/lib/agent';
import { type UserCredential } from 'firebase/auth';

import {
  generateRandomInteger,
  generateRandomString
} from '../testUtils/testHelpers';
import boatUtils from '../testUtils/boatUtils';
import testDatabase from '../testUtils/testDatabase';
import userUtils from '../testUtils/userUtils';

import { Sailboat, User, UserSailboats } from '../../src/models';

export const boatTestSuite = (api: TestAgent) => describe('/boat', () => {
  const baseUrl = '/api/v1/boat';

  describe('When no boats exist', () => {

    describe('Addition of new boats', () => {

      describe('Succeeds', () => {

        test('with valid data', async () => {
          const sailboatData = {
            name: 'jest test boat 1',
            sailNumber: 'fin-123',
            description: 'A cool testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(201)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.boat).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.boatIdentity).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const { id: boatId, ...restBoat } = res.body.boat;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const { id: boatIdentityId, ...restBoatIdentity } = res.body.boatIdentity;

          expect(boatId).toEqual(expect.any(Number));
          expect(boatId).toEqual(boatIdentityId);

          expect(restBoat).toStrictEqual({
            ...sailboatData,
            sailNumber: 'FIN-123',
            boatType: 'SAILBOAT',
            users: [{
              id: user.user.id,
              displayName: user.user.displayName,
            }]
          });

          expect(restBoatIdentity).toStrictEqual({
            name: sailboatData.name,
            boatType: 'SAILBOAT',
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount + 1);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount + 1);
        });

        test('with valid data where sailNumber is null', async () => {
          const sailboatData = {
            name: 'jest test boat 2',
            sailNumber: null,
            description: 'A cool testboat with sailnumber null',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(201)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.boat).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.boatIdentity).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const { id: boatId, ...restBoat } = res.body.boat;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const { id: boatIdentityId, ...restBoatIdentity } = res.body.boatIdentity;

          expect(boatId).toEqual(expect.any(Number));
          expect(boatId).toEqual(boatIdentityId);

          expect(restBoat).toStrictEqual({
            ...sailboatData,
            boatType: 'SAILBOAT',
            users: [{
              id: user.user.id,
              displayName: user.user.displayName,
            }]
          });

          expect(restBoatIdentity).toStrictEqual({
            name: sailboatData.name,
            boatType: 'SAILBOAT',
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount + 1);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount + 1);
        });

        test('with valid data where description is null', async () => {
          const sailboatData = {
            name: 'jest test boat 3',
            sailNumber: 'Swe-99999',
            description: null,
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(201)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.boat).toBeDefined();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.boatIdentity).toBeDefined();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const { id: boatId, ...restBoat } = res.body.boat;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const { id: boatIdentityId, ...restBoatIdentity } = res.body.boatIdentity;

          expect(boatId).toEqual(expect.any(Number));
          expect(boatId).toEqual(boatIdentityId);

          expect(restBoat).toStrictEqual({
            ...sailboatData,
            sailNumber: 'SWE-99999',
            boatType: 'SAILBOAT',
            users: [{
              id: user.user.id,
              displayName: user.user.displayName,
            }]
          });

          expect(restBoatIdentity).toStrictEqual({
            name: sailboatData.name,
            boatType: 'SAILBOAT',
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount + 1);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount + 1);
        });

      }); // Succeeds

      describe('Fails', () => {

        test('when request type is not create', async () => {
          const sailboatData = {
            name: 'jest test fail boat 1',
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'new',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              type: {
                _errors: ['Invalid literal value, expected "create"']
              }
            }
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('when boatType value is missing', async () => {
          const sailboatData = {
            name: 'jest test fail boat 2',
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              boatType: {
                _errors: ['Required']
              }
            }
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('when boatType value is not enum BoatType.Sailboat = SAILBOAT', async () => {
          const sailboatData = {
            name: 'jest test fail boat 3',
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: '8MR',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              boatType: {
                _errors: ['Invalid enum value. Expected \'SAILBOAT\', received \'8MR\'']
              }
            }
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('with no data object', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: ['Required']
              }
            }
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('when data is empty object', async () => {
          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: { },
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                name: { _errors: ['Required'] },
                sailNumber: { _errors: ['Required'] },
                description: { _errors: ['Required'] },
              }
            }
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('when data contains extra fields', async () => {
          const sailboatData = {
            name: 'jest failed test boat',
            sailNumber: 'fin-123',
            description: 'A cool testboat with too many fields given',
            extraField: 'garbage',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: ['Unrecognized key(s) in object: \'extraField\'']
              }
            }
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if name is missing', async () => {
          const sailboatData = {
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                name: {
                  _errors: ['Required']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if name is null', async () => {
          const sailboatData = {
            name: null,
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                name: {
                  _errors: ['Expected string, received null']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if name is too short', async () => {
          const sailboatData = {
            name: 'X',
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                name: {
                  _errors: ['String must contain at least 2 character(s)']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if name is too long', async () => {
          const sailboatData = {
            name: generateRandomString(65),
            sailNumber: 'fin-123',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                name: {
                  _errors: ['String must contain at most 64 character(s)']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if sailNumber is too short (empty string)', async () => {
          const sailboatData = {
            name: 'jest test fail boat 4',
            sailNumber: '',
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                sailNumber: {
                  _errors: ['String must contain at least 1 character(s)']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if sailNumber is too long', async () => {
          const sailboatData = {
            name: 'jest test fail boat 5',
            sailNumber: generateRandomString(17),
            description: 'A failed testboat with all fields given',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                sailNumber: {
                  _errors: ['String must contain at most 16 character(s)']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if description is too short', async () => {
          const sailboatData = {
            name: 'jest test fail boat 6',
            sailNumber: 'fin-123',
            description: 'tst',
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                description: {
                  _errors: ['String must contain at least 4 character(s)']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('if description is too long', async () => {
          const sailboatData = {
            name: 'jest test fail boat 7',
            sailNumber: 'fin-123',
            description: generateRandomString(257),
          };

          const user = await userUtils.createSignedInUser();
          const idToken = await user.credentials.user.getIdToken();
          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .set('Authorization', `Bearer ${idToken}`)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 400,
            error: {
              _errors: [],
              data: {
                _errors: [],
                description: {
                  _errors: ['String must contain at most 256 character(s)']
                },
              },
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

        test('without authorization', async () => {
          const sailboatData = {
            name: 'unauthorized users boat',
            sailNumber: 'fin-123',
            description: 'A cool testboat with all fields given',
          };

          const initialSailboatCount = await testDatabase.sailboatCount();
          const initialUserSailboatsCount = await testDatabase.userSailboatsCount();
          const res = await api
            .post(baseUrl)
            .send({
              type: 'create',
              boatType: 'SAILBOAT',
              data: sailboatData,
            })
            .expect(401)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 401,
            error: {
              message: 'Unauthorized',
            },
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount);
        });

      }); // Fails

    }); // Addition of new boats

  }); // When no boats exist

  describe('When boats exist', () => {
    let userBoatInDb: {
      user: User,
      credentials: UserCredential,
      sailboat: Sailboat,
      userSailboats: UserSailboats | undefined,
    } | undefined = undefined;

    beforeAll(async () => {
      const user = await userUtils.createSignedInUser();
      const boat = await boatUtils.createBoatForUser(user.user);
      userBoatInDb = {
        ...user,
        ...boat,
      };
    });

    describe('Fetching single boat', () => {

      test('succeeds when fetching by id', async () => {
        if (!userBoatInDb) {
          throw new Error('Internal test error: No userBoat in DB');
        }

        const res = await api
          .get(`${baseUrl}/${userBoatInDb.sailboat.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toStrictEqual({
          id: userBoatInDb.sailboat.id,
          boatType: userBoatInDb.sailboat.boatType,
          name: userBoatInDb.sailboat.name,
          description: userBoatInDb.sailboat.description,
          sailNumber: userBoatInDb.sailboat.sailNumber?.toUpperCase(),
          users: [{
            id: userBoatInDb.user.id,
            displayName: userBoatInDb.user.displayName
          }],
        });
      });

      test('fails with status 404 for non existing ID', async () => {
        let nonExistingSailboatId: number = generateRandomInteger();
        while ((await testDatabase.getSailboatByPk(nonExistingSailboatId)) !== null) {
          nonExistingSailboatId = generateRandomInteger();
        }

        const res = await api
          .get(`${baseUrl}/${nonExistingSailboatId}`)
          .expect(404)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toStrictEqual({
          status: 404,
          error: {
            message: `Boat with ID ${nonExistingSailboatId} was not found`,
          },
        });
      });

      test('fails with status 400 for malformed ID', async () => {
        if (!userBoatInDb) {
          throw new Error('Internal test error: No userBoat in DB');
        }

        const malformedId = `0x${userBoatInDb.sailboat.id}`;

        const res = await api
          .get(`${baseUrl}/${malformedId}`)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toStrictEqual({
          status: 400,
          error: {
            message: `Invalid ID for boat: '${malformedId}'`,
          },
        });
      });

    }); // Fetching single boat

    describe('Updating boats', () => {

      describe('Succeeds', () => {

        describe('When authorized user', () => {

          beforeEach(async () => {
            const user = await userUtils.createSignedInUser();
            const boat = await boatUtils.createBoatForUser(user.user);
            userBoatInDb = {
              ...user,
              ...boat,
            };
          });

          test('updates her own boat name', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedName = 'updated jest test boat 1';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  name: updatedName
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              boat: {
                id: userBoatInDb.sailboat.id,
                boatType: userBoatInDb.sailboat.boatType,
                name: updatedName,
                sailNumber: userBoatInDb.sailboat.sailNumber,
                description: userBoatInDb.sailboat.description,
                users: [{
                  id: userBoatInDb.user.id,
                  displayName: userBoatInDb.user.displayName,
                }],
              },
              boatIdentity: {
                id: userBoatInDb.sailboat.id,
                name: updatedName,
                boatType: userBoatInDb.sailboat.boatType,
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal?.name).toBe(updatedName);
          });

          test('updates her own boat sailNumber with a proper sail number', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedSailNumber = 'updated-123';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  sailNumber: updatedSailNumber
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              boat: {
                id: userBoatInDb.sailboat.id,
                boatType: userBoatInDb.sailboat.boatType,
                name: userBoatInDb.sailboat.name,
                sailNumber: updatedSailNumber.toUpperCase(),
                description: userBoatInDb.sailboat.description,
                users: [{
                  id: userBoatInDb.user.id,
                  displayName: userBoatInDb.user.displayName,
                }],
              },
              boatIdentity: {
                id: userBoatInDb.sailboat.id,
                name: userBoatInDb.sailboat.name,
                boatType: userBoatInDb.sailboat.boatType,
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal?.sailNumber).toBe(updatedSailNumber.toUpperCase());
          });

          test('updates her own boat sailNumber to be null', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            expect(userBoatInDb.sailboat.sailNumber).not.toBeNull();

            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  sailNumber: null,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              boat: {
                id: userBoatInDb.sailboat.id,
                boatType: userBoatInDb.sailboat.boatType,
                name: userBoatInDb.sailboat.name,
                sailNumber: null,
                description: userBoatInDb.sailboat.description,
                users: [{
                  id: userBoatInDb.user.id,
                  displayName: userBoatInDb.user.displayName,
                }],
              },
              boatIdentity: {
                id: userBoatInDb.sailboat.id,
                name: userBoatInDb.sailboat.name,
                boatType: userBoatInDb.sailboat.boatType,
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal).not.toBeNull();
            expect(sailboatInDbFinal?.sailNumber).toBeNull();
          });

          test('updates her own boat description with a proper description', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedDescription = 'This is an updated description for the jest testboat';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  description: updatedDescription
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              boat: {
                id: userBoatInDb.sailboat.id,
                boatType: userBoatInDb.sailboat.boatType,
                name: userBoatInDb.sailboat.name,
                sailNumber: userBoatInDb.sailboat.sailNumber,
                description: updatedDescription,
                users: [{
                  id: userBoatInDb.user.id,
                  displayName: userBoatInDb.user.displayName,
                }],
              },
              boatIdentity: {
                id: userBoatInDb.sailboat.id,
                name: userBoatInDb.sailboat.name,
                boatType: userBoatInDb.sailboat.boatType,
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal?.description).toBe(updatedDescription);
          });

          test('updates her own boat description to be null', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            expect(userBoatInDb.sailboat.description).not.toBeNull();

            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  description: null,
                },
              })
              .expect(200)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              boat: {
                id: userBoatInDb.sailboat.id,
                boatType: userBoatInDb.sailboat.boatType,
                name: userBoatInDb.sailboat.name,
                sailNumber: userBoatInDb.sailboat.sailNumber,
                description: null,
                users: [{
                  id: userBoatInDb.user.id,
                  displayName: userBoatInDb.user.displayName,
                }],
              },
              boatIdentity: {
                id: userBoatInDb.sailboat.id,
                name: userBoatInDb.sailboat.name,
                boatType: userBoatInDb.sailboat.boatType,
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal).not.toBeNull();
            expect(sailboatInDbFinal?.description).toBeNull();
          });

        }); // When authorized user

      }); // Succeeds

      describe('Fails', () => {

        beforeAll(async () => {
          const user = await userUtils.createSignedInUser();
          const boat = await boatUtils.createBoatForUser(user.user);
          userBoatInDb = {
            ...user,
            ...boat,
          };
        });

        describe('When authorized user', () => {

          test('patch request type is missing', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedName = 'Invalid request without a type';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                boatType: 'SAILBOAT',
                data: {
                  name: updatedName
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                message: 'Post request must contain a type',
                type: {
                  _errors: ['Required'],
                },
              },
            });
          });

          test('patch request type is not update', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedName = 'Invalid request with type set to patch';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'patch',
                boatType: 'SAILBOAT',
                data: {
                  name: updatedName
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                _errors: [],
                type: {
                  _errors: ['Invalid literal value, expected "update"'],
                },
              },
            });
          });

          test('boatType value is missing', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedName = 'Invalid request without a type';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                data: {
                  name: updatedName
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                _errors: [],
                boatType: {
                  _errors: ['Required']
                }
              }
            });
          });

          test('boatType value is not enum BoatType.Sailboat = SAILBOAT', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const updatedName = 'Invalid request with type set to patch';
            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'sailboat',
                data: {
                  name: updatedName
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                _errors: [],
                boatType: {
                  _errors: ['Invalid enum value. Expected \'SAILBOAT\', received \'sailboat\'']
                }
              }
            });
          });

          test('patch request contains no data object', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                _errors: [],
                data: {
                  _errors: ['Required'],
                },
              },
            });
          });

          test('patch request data is empty object', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: { },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                data: {
                  _errors: ['Patch request data object must contain data'],
                },
                message: 'Patch request must contain data',
              },
            });
          });

          test('patch request data object contains unrecognized data', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const idToken = await userBoatInDb.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  name: 'Sailboat one too many',
                  sailNumber: 'WIN-1337',
                  description: 'Three fields is okay, four is one too many',
                  invalidExtraField: true,
                },
              })
              .expect(400)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 400,
              error: {
                _errors: [],
                data: {
                  _errors: ['Unrecognized key(s) in object: \'invalidExtraField\''],
                },
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal?.name).toBe(userBoatInDb.sailboat.name);
            expect(sailboatInDbFinal?.sailNumber).toBe(userBoatInDb.sailboat.sailNumber);
            expect(sailboatInDbFinal?.description).toBe(userBoatInDb.sailboat.description);
          });

          test('attempts to update a non existing race, returns 404', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const idToken = await userBoatInDb.credentials.user.getIdToken();
            let nonExistingBoatId: number = generateRandomInteger();
            while ((await testDatabase.getSailboatByPk(nonExistingBoatId)) !== null) {
              nonExistingBoatId = generateRandomInteger();
            }

            const res = await api
              .patch(`${baseUrl}/${nonExistingBoatId}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  name: 'boat nr. 404',
                },
              })
              .expect(404)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 404,
              error: {
                message: `Boat with ID ${nonExistingBoatId} was not found`,
              },
            });
          });

          test('attempts to update a boat where user is not int the userId-sailboatId mapping set of userSailboats junction table, returns 403', async () => {
            if (!userBoatInDb) {
              throw new Error('Internal test error: No userBoat in DB');
            }

            const anotherUser = await userUtils.createSignedInUser();
            expect(await testDatabase.getUserSailboats(anotherUser.user.id, userBoatInDb.sailboat.id)).toBeNull();

            const idToken = await anotherUser.credentials.user.getIdToken();

            const res = await api
              .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
              .set('Authorization', `Bearer ${idToken}`)
              .send({
                type: 'update',
                boatType: 'SAILBOAT',
                data: {
                  name: 'not-my-boat',
                },
              })
              .expect(403)
              .expect('Content-Type', /application\/json/);

            expect(res.body).toBeDefined();
            expect(res.body).toStrictEqual({
              status: 403,
              error: {
                message: 'Forbidden: You dont have the required credentials to update this boat',
              },
            });

            const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
            expect(sailboatInDbFinal?.name).toBe(userBoatInDb.sailboat.name);
          });

        }); // When authorized user

        test('with status 401 when not authorized user attempts to update an existing boat', async () => {
          if (!userBoatInDb) {
            throw new Error('Internal test error: No userBoat in DB');
          }

          const res = await api
            .patch(`${baseUrl}/${userBoatInDb.sailboat.id}`)
            .send({
              type: 'update',
              boatType: 'SAILBOAT',
              data: {
                name: 'failed updated name',
              },
            })
            .expect(401)
            .expect('Content-Type', /application\/json/);

          expect(res.body).toBeDefined();
          expect(res.body).toStrictEqual({
            status: 401,
            error: {
              message: 'Unauthorized',
            },
          });

          const sailboatInDbFinal = await testDatabase.getSailboatByPk(userBoatInDb.sailboat.id);
          expect(sailboatInDbFinal?.name).toBe(userBoatInDb.sailboat.name);
        });

      }); // Fails

    }); // Updating boats

  }); // When boats exist

}); // '/boat'
