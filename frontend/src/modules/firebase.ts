import {
  type FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  type NextOrObserver,
  type Unsubscribe,
  type User,
  connectAuthEmulator,
  signInWithEmailAndPassword as fbAuthSignInWithEmailAndPassword,
  signOut as fbAuthSignOut,
  initializeAuth as fbInitializeAuth,
  getAuth,
  getReactNativePersistence, // NOTE: undefined outside mobile environments
  onAuthStateChanged,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from '../utils/config';
import firebaseConfigObj from '../utils/firebaseConfig';

const initializeAuth = (app: FirebaseApp | undefined) => {
  if (!app) {
    throw new Error('GosaGora misconfiguration: firebaseApp is not defined before auth');
  }

  let fbAuth;
  if (config.IS_MOBILE) {
    if (!getReactNativePersistence) {
      throw new Error('GosaGora environment error: ReactNative Persistence is not available');
    }
    try {
      // NOTE: Throws if auth is already initialized (dev env hot reload)
      fbAuth = fbInitializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } catch (_error: unknown) {
      fbAuth = getAuth(app);
    }
  } else {
    fbAuth = getAuth(app);
  }

  if (config.IS_PRODUCTION_ENV) {
    return fbAuth;
  }

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
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfigObj) : getApp();
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
