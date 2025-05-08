import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { z } from 'zod';

import { isBackendUrlRegex } from './regexes';

// YUP TYPES, TODO Switch config to use yup: => https://stackoverflow.com/questions/66171196/how-to-use-yups-object-shape-with-typescript

const envSchema = z.object({
  ENV: z.enum(['production', 'development', 'test']),
  // NOTE (2025-04-15): zod string().url() validation in react native has a bug and accepts all values: https://github.com/colinhacks/zod/issues/2236
  BACKEND_BASE_URL: z.string().refine(
    (value) => value.length > 0 && isBackendUrlRegex.test(value),
    'BACKEND_BASE_URL is not set or a valid URL'
  ),

  // Should be set in development and test environments.
  // Defined here only as a reference, modules/firebase reads the env variable and connects
  // to the emulator if this is set. Otherwise the the live API will be used.
  FIREBASE_AUTH_EMULATOR_HOST: z.string().min(4).optional(),
});

const parsedEnv = envSchema.safeParse(Constants.expoConfig?.extra);

if (!parsedEnv.success) {
  throw new Error(`GosaGora app misconfiguration, error: ${JSON.stringify(parsedEnv.error.flatten().fieldErrors)}`);
}

export default {
  ENV: parsedEnv.data.ENV,
  BACKEND_BASE_URL: parsedEnv.data.BACKEND_BASE_URL,
  FIREBASE_AUTH_EMULATOR_HOST: parsedEnv.data.FIREBASE_AUTH_EMULATOR_HOST,
  IS_DEVELOPMENT_ENV: parsedEnv.data.ENV === 'development',
  IS_PRODUCTION_ENV: parsedEnv.data.ENV === 'production',
  IS_TEST_ENV: parsedEnv.data.ENV === 'test',
  IS_MOBILE: Platform.OS === 'android' || Platform.OS === 'ios',
};
