import * as Yup from 'yup';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envSchema = Yup.object({
  ENV: Yup.string()
    .defined()
    .oneOf(['production', 'development', 'test'])
    .required(),
  BACKEND_BASE_URL: Yup.string()
    .url()
    .required(),

  // Should be set in development and test environments.
  // Defined here only as a reference, modules/firebase reads the env variable and connects
  // to the emulator if this is set. Otherwise the the live API will be used.
  FIREBASE_AUTH_EMULATOR_HOST: Yup.string()
    .min(4)
    .url()
    .optional(),
});

const parsedEnv: Yup.InferType<typeof envSchema> = (() => {
  try {
    return envSchema.validateSync(Constants.expoConfig?.extra, {
      stripUnknown: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('GosaGora env configuration error:', error.message);
    } else {
      console.error('GosaGora env configuration error:', error);
    }
    throw new Error(); /* TODO: Implement proper error handling and rendering instead of throwing here.
                        * NOTE: process.exit is not defined in mobile environments.
                        *       https://github.com/kordaniel/gosagora/issues/10
                        */
  }
})();

if (parsedEnv.ENV !== 'production' && !parsedEnv.FIREBASE_AUTH_EMULATOR_HOST) {
  throw new Error('GosaGora env configuration error: app is runnig outside production env with no firebase emulator connection configured');
} else if (parsedEnv.ENV === 'production' && parsedEnv.FIREBASE_AUTH_EMULATOR_HOST) {
  throw new Error('GosaGora env configuration error: app is running in production env with with firebase emulator connection configured');
}

export default {
  ENV: parsedEnv.ENV,
  BACKEND_BASE_URL: parsedEnv.BACKEND_BASE_URL,
  FIREBASE_AUTH_EMULATOR_HOST: parsedEnv.FIREBASE_AUTH_EMULATOR_HOST,
  IS_DEVELOPMENT_ENV: parsedEnv.ENV === 'development',
  IS_PRODUCTION_ENV: parsedEnv.ENV === 'production',
  IS_TEST_ENV: parsedEnv.ENV === 'test',
  IS_MOBILE: Platform.OS === 'android' || Platform.OS === 'ios',
};
