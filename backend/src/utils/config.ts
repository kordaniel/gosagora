import dotenv from 'dotenv';
import { z } from 'zod';

import type { EnvironmentType } from '../types';
import { assertNever } from './typeguards';
import logger from './logger';


const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test', 'test-production']),
  PORT: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Not a Number',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  DB_URI: z.string(), // format: postgres://user:pass@url:port without a database name set

  // Parse to ensure credentials are set. Dont export in config, firebase-admin reads the env variable
  // TODO: Implement a check that the file exists and has correct format
  // TODO: Dont require this variable to be set if the env var already is set (google cloud)
  GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  // Should be set in development and test environments
  // If not set, firebase-admin uses the live API
  // Defined her only as a reference. Dont export in config, firebase-admin reads the env variable
  FIREBASE_AUTH_EMULATOR_HOST: process.env.NODE_ENV !== 'production'
    ? z.string().min(4)
    : z.string().optional(),
});

export interface IConfiguration extends Omit<
  z.infer<typeof EnvSchema>, 'GOOGLE_APPLICATION_CREDENTIALS' | 'FIREBASE_AUTH_EMULATOR_HOST'
> {
  IS_PRODUCTION_ENV: boolean;
  IS_DEVELOPMENT_ENV: boolean;
  IS_TEST_ENV: boolean;
}

const createDbUri = (baseurl: string, curEnv: EnvironmentType): string => {
  switch (curEnv) {
    case 'production':      return baseurl;
    case 'development':     return `${baseurl}/gosagora-dev-db`;
    case 'test':            return `${baseurl}/gosagora-test-db`;
    case 'test-production': return `${baseurl}/gosagora-test-db`;
    default: return assertNever(curEnv);
  }
};


dotenv.config();
const startupEnv: string | undefined = process.env.NODE_ENV;

if (startupEnv) {
  dotenv.config({
    path: [`.env.${startupEnv}`],
  });
}

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.infoAllEnvs('Invalid environment configuration, exiting. Error(s):', parsedEnv.error.flatten().fieldErrors);
  process.exit(78); // EX_CONFIG: configuration error
}

const configuration: IConfiguration = {
  NODE_ENV: parsedEnv.data.NODE_ENV !== 'test-production' ? parsedEnv.data.NODE_ENV : 'production',
  PORT: parsedEnv.data.PORT,
  IS_PRODUCTION_ENV: parsedEnv.data.NODE_ENV === 'production',
  IS_DEVELOPMENT_ENV: parsedEnv.data.NODE_ENV === 'development',
  IS_TEST_ENV: parsedEnv.data.NODE_ENV === 'test',
  DB_URI: createDbUri(parsedEnv.data.DB_URI, parsedEnv.data.NODE_ENV),
};

export default configuration;
