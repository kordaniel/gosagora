import TestAgent from 'supertest/lib/agent';

import { generateRandomString } from '../testUtils/testHelpers';
import testDatabase from '../testUtils/testDatabase';
import userUtils from '../testUtils/userUtils';

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

}); // '/boat'
