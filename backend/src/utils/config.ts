import dotenv from 'dotenv';
import { z } from 'zod';

import logger from './logger';

dotenv.config();

const startupEnv: string | undefined = process.env.NODE_ENV;

if (startupEnv) {
  logger.infoAllEnvs('startup env:', startupEnv);
  dotenv.config({
    path: [`.env.${startupEnv}`],
  });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
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
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.infoAllEnvs('Invalid environment configuration, exiting. Errors:', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export default {
  NODE_ENV: parsedEnv.data.NODE_ENV,
  PORT: parsedEnv.data.PORT,
};
