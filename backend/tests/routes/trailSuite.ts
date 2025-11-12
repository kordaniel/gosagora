import TestAgent from 'supertest/lib/agent';

import boatUtils from '../testUtils/boatUtils';
import testDatabase from '../testUtils/testDatabase';
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
          // TODO: Add tests that dont have field public in data
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
        });

      }); // Succeeds

    }); // Addition of new trails

  }); // When no trails exist

}); // '/trail'
