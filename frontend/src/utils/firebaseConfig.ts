import * as Yup from 'yup';

import config from './config';

import firebaseConfigData from '../../firebaseConfig.json'; // TODO: Bundle properly
import firebaseDevConfigData from '../../firebaseDevConfig.json'; // TODO: Bundle properly
import firebaseTestConfigData from '../../firebaseTestConfig.json'; // TODO: Bundle properly

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

/**
 * https://firebase.google.com/docs/web/learn-more#config-object
 * Note: The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
 * Visit [Understand Firebase Projects](https://firebase.google.com/docs/projects/learn-more#config-files-objects)
 * to learn more about this config object.
 */
const validationSchema: Yup.Schema<FirebaseConfig> = Yup.object({
  // Required: a simple encrypted string used when calling certain APIs that don't need to
  // access private user data (example value: AIzaSyDOCAbC123dEf456GhI789jKl012-MnO)
  apiKey: Yup.string().strict().required(),
  authDomain: Yup.string().strict().required(),

  // Required: a user-defined unique identifier for the project across all of Firebase and Google Cloud.
  // This identifier may appear in URLs or names for some Firebase resources, but it should generally be
  // treated as a convenience alias to reference the project. (example value: myapp-project-123)
  projectId: Yup.string().strict().required(),
  storageBucket: Yup.string().optional().min(1).strict(),
  messagingSenderId: Yup.string().optional().min(1).strict(),

  // Required: the unique identifier for the Firebase app across all of Firebase with a platform-specific format:
  appId: Yup.string().strict().required(),

  // For Google Analytics https://firebase.google.com/docs/analytics/get-started?platform=web#add-sdk
  measurementId: Yup.string().optional().min(1).strict(),
});

const parseFirebaseConfig = (firebaseConfigData: unknown): FirebaseConfig => {
  // TODO: Handle error => render instructions and disable all firebase operations.
  try {
    if (config.IS_TEST_ENV) {
      return validationSchema.validateSync(firebaseTestConfigData);
    } else if (config.IS_DEVELOPMENT_ENV) {
      return validationSchema.validateSync(firebaseDevConfigData);
    } else if (config.IS_PRODUCTION_ENV) {
      return validationSchema.validateSync(firebaseConfigData);
    } else {
      throw Error('Unable to load firebase config');
    }
  } catch (error: unknown) {
    if (error instanceof Yup.ValidationError) {
      console.error('Invalid firebase config:', error.message);
    } else {
      console.error(JSON.stringify(error));
    }
    throw error;
  }
};

const firebaseConfig: FirebaseConfig = parseFirebaseConfig(firebaseConfigData);

export default firebaseConfig;
