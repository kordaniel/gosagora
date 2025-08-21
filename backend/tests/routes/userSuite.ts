import TestAgent from 'supertest/lib/agent';
import { type UserCredential } from 'firebase/auth';

import { generateRandomInteger } from '../testUtils/testHelpers';
import raceUtils from '../testUtils/raceUtils';
import testDatabase from '../testUtils/testDatabase';
import userUtils from '../testUtils/userUtils';

import { Race, User } from '../../src/models';

export const userTestSuite = (api: TestAgent) => describe('/user', () => {
  const baseUrl = '/api/v1/user';

  describe('Deleting user', () => {
    let userWithoutRaceCredentials: {
      user: User;
      credentials: UserCredential;
    } | undefined = undefined;
    let userWithRaceCredentials: {
      user: User;
      credentials: UserCredential;
    } | undefined = undefined;
    let usersRace: Race | undefined = undefined;

    beforeAll(async () => {
      userWithoutRaceCredentials = await userUtils.createSignedInUser();
      const raceInDb = await raceUtils.createRace({ public: true });
      userWithRaceCredentials = { user: raceInDb.user, credentials: raceInDb.userCredentials };
      usersRace = raceInDb.race;
    });

    test('Responds with status 204 when authorized user attempts to delete a non existing user', async () => {
      if (!userWithoutRaceCredentials) {
        throw new Error('Internal test error: No user without race in DB');
      }

      const idToken = await userWithoutRaceCredentials.credentials.user.getIdToken();
      let nonExistingUserId: number = generateRandomInteger();
      while ((await testDatabase.getUserByPk(nonExistingUserId)) !== null) {
        nonExistingUserId = generateRandomInteger();
      }

      const initialUserCount = await testDatabase.userCount();

      const res = await api
        .delete(`${baseUrl}/${nonExistingUserId}`)
        .set('Authorization', `Bearer ${idToken}`)
        .expect(204);

      expect(res.body).toStrictEqual({});
      expect(await testDatabase.userCount()).toEqual(initialUserCount);
    });

    describe('Succeeds', () => {

      test('when authorized user without created races deletes her own account', async () => {
        if (!userWithoutRaceCredentials) {
          throw new Error('Internal test error: no user without race in DB');
        }

        const idToken = await userWithoutRaceCredentials.credentials.user.getIdToken();
        const initialUserInDb = await testDatabase.getUserByPk(userWithoutRaceCredentials.user.id, true);
        const initialUserCount = await testDatabase.userCount();

        if (initialUserInDb === null) {
          throw new Error('Internal test error: initialUserInDb should not be null');
        }

        expect(initialUserInDb.deletedAt).toBeNull();

        const res = await api
          .delete(`${baseUrl}/${userWithoutRaceCredentials.user.id}`)
          .set('Authorization', `Bearer ${idToken}`)
          .expect(204);

        expect(res.body).toStrictEqual({});

        const userInDbFinal = await testDatabase.getUserByPk(userWithoutRaceCredentials.user.id, false);
        expect(userInDbFinal?.deletedAt).not.toBeNull();
        expect(await testDatabase.userCount()).toEqual(initialUserCount - 1);
      });

      test('when authorized user with a created race deletes her own account but not the her race', async () => {
        if (!userWithRaceCredentials) {
          throw new Error('Internal test error: no user with a race in DB');
        }
        if (!usersRace) {
          throw new Error('Internal test error: no users race in DB');
        }

        const idToken = await userWithRaceCredentials.credentials.user.getIdToken();
        const initialUserInDb = await testDatabase.getUserByPk(userWithRaceCredentials.user.id, true);
        const initialUserCount = await testDatabase.userCount();
        const initialRaceInDb = await testDatabase.getRaceByPk(usersRace.id);

        if (initialUserInDb === null) {
          throw new Error('Internal test error: initialUserInDb should not be null');
        }
        if (initialRaceInDb === null) {
          throw new Error('Internal test error: initalRaceInDb should not be null');
        }

        expect(initialUserInDb.deletedAt).toBeNull();
        expect(initialRaceInDb.deletedAt).toBeNull();

        const res = await api
          .delete(`${baseUrl}/${userWithRaceCredentials.user.id}`)
          .set('Authorization', `Bearer ${idToken}`)
          .expect(204);

        expect(res.body).toStrictEqual({});

        const userInDbFinal = await testDatabase.getUserByPk(userWithRaceCredentials.user.id, false);
        expect(userInDbFinal?.deletedAt).not.toBeNull();
        expect(await testDatabase.userCount()).toEqual(initialUserCount - 1);

        const raceInDbFinal = await testDatabase.getRaceByPk(usersRace.id);
        expect(raceInDbFinal).not.toBeNull();
        expect(raceInDbFinal?.deletedAt).toBeNull();
      });

    }); // Succeeds

    describe('Fails', () => {
      const usersNotToDelete: Array<{
        user: User;
        credentials: UserCredential;
      }> = [];

      beforeAll(async () => {
        usersNotToDelete.push(await userUtils.createSignedInUser());
        usersNotToDelete.push(await userUtils.createSignedInUser());
      });

      test('when unauthorized user tries to delete an existing account', async () => {
        if (usersNotToDelete.length !== 2 || !usersNotToDelete[0]) {
          throw new Error('Internal test error: usersNotToDelete has not been initialized');
        }

        const initialUserCount = await testDatabase.userCount();

        const res = await api
          .delete(`${baseUrl}/${usersNotToDelete[0].user.id}`)
          .expect(401)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toStrictEqual({
          status: 401,
          error: {
            message: 'Unauthorized'
          }
        });

        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

      test('when authorized user tries to delete an another users account', async () => {
        if (usersNotToDelete.length !== 2 || !usersNotToDelete[0] || !usersNotToDelete[1]) {
          throw new Error('Internal test error: usersNotToDelete has not been initialized');
        }

        const idToken = await usersNotToDelete[0].credentials.user.getIdToken();
        const initialUserCount = await testDatabase.userCount();

        const res = await api
          .delete(`${baseUrl}/${usersNotToDelete[1].user.id}`)
          .set('Authorization', `Bearer ${idToken}`)
          .expect(403)
          .expect('Content-Type', /application\/json/);

        expect(res.body).toBeDefined();
        expect(res.body).toStrictEqual({
          status: 403,
          error: {
            message: 'Forbidden: You dont have the required credentials to delete this user'
          }
        });

        expect(await testDatabase.userCount()).toEqual(initialUserCount);
      });

    }); // Fails

  }); // Deleting user

}); // '/user'
