import {
  type FirebaseApp,
  initializeApp,
} from 'firebase/app';

import {
  type NextOrObserver,
  type Unsubscribe,
  type User,
  connectAuthEmulator,
  signInWithEmailAndPassword as fbAuthSignInWithEmailAndPassword,
  signOut as fbAuthSignOut,
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

import config from '../utils/config';
import firebaseConfigObj from '../utils/firebaseConfig';


const initializeAuth = (app: FirebaseApp | undefined) => {
  if (config.IS_PRODUCTION_ENV) {
    // TODO: Add check that app is initialized!!
    return getAuth(app);
  }

  const fbAuth = getAuth();

  if (config.FIREBASE_AUTH_EMULATOR_HOST) {
    try {
      connectAuthEmulator(fbAuth, config.FIREBASE_AUTH_EMULATOR_HOST, { disableWarnings: true });
    } catch (error: unknown) {
      console.error('Error connecting to firebase auth emulator:', error);
      if (error instanceof Error) {
        console.error('Error connecting to firebase auth emulator, mesage:', error.message);
      }
    }
  } else {
    console.warn('Initializing firebase auth outside production env without emulator connection');
  }

  return fbAuth;
};


let firebaseApp;

try {
  firebaseApp = initializeApp(firebaseConfigObj);
  //const analytics = getAnalytics(firebaseApp); // TODO: Setup analytics
} catch (error: unknown) {
  console.error('Error running firebase initializeApp:', error);
  if (error instanceof Error) {
    console.error('Error running firebase initializeApp, message:', error.message);
  }
}

export const firebaseAuth = initializeAuth(firebaseApp);

const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
  await fbAuthSignInWithEmailAndPassword(firebaseAuth, email, password);
};

const signOut = async (): Promise<void> => {
  await fbAuthSignOut(firebaseAuth);
};

const addOnAuthChangeObserver = (observer: NextOrObserver<User>): Unsubscribe => {
  return onAuthStateChanged(firebaseAuth, observer);
};

const getCurrentUserIdToken = async (): Promise<string | null> => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    return null;
  }

  return await currentUser.getIdToken();
};

export default {
  addOnAuthChangeObserver,
  getCurrentUserIdToken,
  signInWithEmailAndPassword,
  signOut,
};
