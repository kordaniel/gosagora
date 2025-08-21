import TestAgent from 'supertest/lib/agent';

import testDatabase from '../testUtils/testDatabase';
import userUtils from '../testUtils/userUtils';

export const boatTestSuite = (api: TestAgent) => describe('/boat', () => {
  const baseUrl = '/api/v1/boat';

  describe('When no boats exist', () => {

    describe('Addition of new boats', () => {

      describe('Succeeds', () => {

        test('when authorized user creates a new sailboat', async () => {
          const sailboatData = {
            name: 'jest test boat 1',
            sailNumber: 'FIN-123',
            description: 'A cool boat that is added in the tests',
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

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { id, ...rest } = res.body;

          expect(id).toEqual(expect.any(Number));

          expect(rest).toStrictEqual({
            ...sailboatData,
            boatType: 'SAILBOAT',
            users: [{
              id: user.user.id,
              displayName: user.user.displayName,
            }]
          });

          expect(await testDatabase.sailboatCount()).toEqual(initialSailboatCount + 1);
          expect(await testDatabase.userSailboatsCount()).toEqual(initialUserSailboatsCount + 1);
        });

      }); // Succeeds

    }); // Addition of new boats

  }); // When no boats exist

}); // '/boat'
