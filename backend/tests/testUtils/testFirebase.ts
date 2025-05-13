/**
 * Provides firebase client operations for the tests and wraps the
 * firebase admin module, asserting that the application is connected
 * to a firebase emulator instead of the live API.
 */

import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

import firebase, {
  connectToFirebase
} from '../../src/modules/firebase';
import config from '../../src/utils/config';


if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  throw Error('The required environment variable FIREBASE_AUTH_EMULATOR_HOST is not defined');
}

const firebaseClientApp = initializeApp({
  'apiKey': 'firebase-local-emulator-fake-key',
});

const clientAuth = getAuth(firebaseClientApp);
connectAuthEmulator(clientAuth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);

const addNewUserEmailPassword = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(clientAuth, email, password);
};

const dropUsers = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to drop firebase auth users outside test environment');
  }

  const users = await firebase.getAllUsers(1000);
  if (!users || users.users.length === 0) {
    return;
  }

  if (users.users.length >= 1000) {
    // This implementation of dropUsers is only able to delete at most 1000 users.
    // If there are more users in the firebase auth connection, rate limited iteration
    // with multiple API calls is required.
    // TODO: Implement, if necessary.
    throw new Error('Error attempting to drop firebase auth users, usercount >= 1000');
  }

  const uids = users.users.map(u => u.uid);
  const result = await firebase.deleteUsers(uids);
  if (!result || result.successCount !== uids.length) {
    throw new Error(`Attempted to delete ${uids.length} users from firebase auth. Succeded to delete ${result?.successCount}. Exiting.`);
  }
};

export default {
  connectToFirebase,
  dropUsers,
  addNewUserEmailPassword,
};
