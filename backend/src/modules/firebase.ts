import { applicationDefault, initializeApp } from 'firebase-admin/app';

import {
  Auth,
  type DecodedIdToken,
  FirebaseAuthError,
  //type ListUsersResult,
  getAuth,
  //UserRecord,
} from 'firebase-admin/auth';

import logger from '../utils/logger';
import { ServiceError } from '../errors/applicationError';

/**********************************************
 * Documentation
 * https://firebase.google.com/docs/admin/setup
 *
 * Read the whole Admin section, starting from Introduction to the Admin Auth API:
 * https://firebase.google.com/docs/auth/admin
 *
 * Initialize the SDK in non-Google environments
 * ---------------------------------------------
 *
 * Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the file path of
 * the JSON file that contains your service account key.
 *
 * To optionally specify initialization options for services such as Realtime Database,
 * Cloud Storage, or Cloud Functions, use the FIREBASE_CONFIG environment variable.
 *
 * ID Token Verification (see Verify ID Tokens)
 * ID Tokens comform to the OpenID Connect Spec and contain data to identify a user
 *  If your Firebase client app communicates with your backend server, you might need to identify
 *  the currently signed-in user on your server so you can perform server-side logic on their behalf.
 * You can do this securely by using ID tokens, which are created by Firebase when a user signs into an Firebase app
 * You can send, verify, and inspect these tokens from your own backends. This allows you to securely
 * identify the currently signed in user and authorize them into your own backend resources.
 *
 *********************************************/

// TODO: Add local dev/test environments
// Local instance of development environment
// Using Firebase Local Emulator Suite
// If using firebase cloud: Project settings => environment => configure prod/dev tags

// Introduction to Firebase Local Emulator Suite: https://firebase.google.com/docs/emulator-suite
// Connect your app and start prototyping: https://firebase.google.com/docs/emulator-suite/connect_and_prototype


const fbAdminApp = initializeApp({ credential: applicationDefault(), });
logger.info('Firebase-admin initialized, name:', fbAdminApp.name); // [DEFAULT]

let auth: Auth | undefined;

export const connectToFirebase = async () => {
  logger.info('Setting up firebase connection(s)');
  auth = getAuth(fbAdminApp);
  if (await checkConnection()) {
    logger.info('Firebase connection(s) established');
    logger.info('Firebase service connections:');
    Object.entries(isUsingEmulator()).forEach(([k, v]) => {
      logger.info(` - ${k}: connected to ${v ? 'emulator': 'live API'}`);
    });
  } else {
    logger.error(
      'Error connecting to Firebase, exiting. Attempted to use emulator:',
      Object.entries(isUsingEmulator()).map(([k, v]) => ({ [k]: v }))
    );
    process.exit(69); // EX_UNAVAILABLE: service unavailable
  }
};

const isUsingEmulator = () => {
  return {
    auth: Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST),
  };
};

const checkConnection = async () => {
  try {
    if (!auth) {
      return false;
    }
    await auth.getUser('no-existing-id');
    return true;
  } catch (error: unknown) {
    return error instanceof FirebaseAuthError &&
           error.code === 'auth/user-not-found';
  }
};

// relevant FirebaseAuthError types, TODO: Add error handling
// auth/id-token-revoked
// auth/internal-error (firebase internal error, wait for it to be fixed or report bug)
// auth/invalid-credential The credential used to authenticate the Admin SDKs cannot be used to perform the desired action.
// auth/project-not-found No Firebase project was found for the credential used to initialize the Admin SDKs. Refer to Set up a Firebase project for documentation on how to generate a credential for your project and use it to authenticate the Admin SDKs.
// auth/invalid-uid The provided uid must be a non-empty string with at most 128 characters.
// auth/too-many-requests
const verifyIdToken = async (fbIdToken: string): Promise<DecodedIdToken> => {
  if (!auth) {
    throw new ServiceError('GosaGora service error: unable to perform IdToken verification');
  }

  const decodedToken = await auth.verifyIdToken(fbIdToken);
  //console.log('decoded token:', decodedToken);
  //console.log(' firebase:', decodedToken.firebase);
  return decodedToken;
};

/*
const getUserByUid = async (fbUid: string): Promise<UserRecord | null> => {
  try {
    const user = await auth.getUser(fbUid);
    return user;
  } catch (error: unknown) {
    console.log('getUser error:', error);
    return null;
  }
};

const updateUser = async (fbUid: string): Promise<UserRecord | null> => {
  try {
    const updatedUser = await auth.updateUser(fbUid, {
      // fields to update
    });
    return updatedUser;
  } catch (error: unknown) {
    console.log('updateUser error:', error);
    return null;
  }
};

const deleteUser = async (fbUid: string): Promise<boolean> => {
  try {
    await auth.deleteUser(fbUid);
    return true;
  } catch (error: unknown) {
    console.log('deleteUser error:', error);
    return false;
  }
};

const getAllUsers = async (pageToken?: string): Promise<ListUsersResult | null> => {
  try {
    const users = await auth.listUsers(100, pageToken);
    console.log('listUsers pageToken:', users.pageToken);
    console.log('listUsers:', users.users);
    return users;
  } catch (error: unknown) {
    console.log('listUsersError:', error);
    return null;
  }
};
*/

export default {
  verifyIdToken,
};
