import { z } from 'zod';
import Constants from 'expo-constants';

import { isBackendUrlRegex } from './regexes';

const envSchema = z.object({
  ENV: z.enum(['production', 'development', 'test']),
  // NOTE (2025-04-15): zod string().url() validation in react native has a bug and accepts all values: https://github.com/colinhacks/zod/issues/2236
  BACKEND_BASE_URL: z.string().refine(
    (value) => value.length > 0 && isBackendUrlRegex.test(value),
    'BACKEND_BASE_URL is not set or a valid URL'
  ),
});

const parsedEnv = envSchema.safeParse(Constants.expoConfig?.extra);

if (!parsedEnv.success) {
  throw new Error(`GosaGora app misconfiguration, error: ${JSON.stringify(parsedEnv.error.flatten().fieldErrors)}`);
}

export default {
  ENV: parsedEnv.data.ENV,
  BACKEND_BASE_URL: parsedEnv.data.BACKEND_BASE_URL,
  IS_DEVELOPMENT_ENV: parsedEnv.data.ENV === 'development',
  IS_PRODUCTION_ENV: parsedEnv.data.ENV === 'production',
};
