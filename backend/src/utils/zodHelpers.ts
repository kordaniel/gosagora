import { type ZodTypeDef, z } from 'zod';

import type { AssertEqual } from '../types';
import { isJSISOUTCDateStr } from './dateTools';

/**
 * Nested function that returns a ZodSchema and ensures that the Zod schema type exactly matches
 * the type you pass in the nested function. It doesn't allow extra properties.
 * Optional properties in the target interface are still required to exist.
 *
 * Consider defining the interface as a zodSchema and infer the type from the schema
 * instead of using this function.
 *
 * Source: https://github.com/colinhacks/zod/issues/372#issuecomment-2445439772
 *
 * @example
 * interface User { .. }
 * const User = matches<User>()( z.object({..}) );
 *
 * @returns Callable generic function that asserts that the only passed in argument is a ZodObject with a schema that exactly matches T.
 */
export const matchingZodSchema = <T>() =>
  <S extends z.ZodType<T, ZodTypeDef, unknown>>(
    schema: AssertEqual<S['_output'], T> extends true
      ? S
      : S & {
        'types do not match': {
          expected: T;
          received: S['_output'];
        };
      },
  ): S => {
    return schema;
  };

export const zStringToDateSchema = (
  opts?: { min?: Date; max?: Date },
  messages?: { min?: string; max?: string; }
) => {
  return z.string({
    invalid_type_error: 'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string'
  }).transform((val, ctx) => {
    const parsed = new Date(val);
    if (!isJSISOUTCDateStr(val) || isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: 'Invalid date, expected a "YYYY-MM-DDTHH:mm:ss.sssZ" formatted UTC timestamp string',
      });
      return z.NEVER;
    }

    if (opts?.min && parsed < opts.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: messages?.min ? messages.min : 'Invalid date, expected a later timestamp',
      });
      return z.NEVER;
    }

    if (opts?.max && parsed > opts.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: messages?.max ? messages.max : 'Invalid date, expected an earlier timestamp',
      });
      return z.NEVER;
    }

    return parsed;
  });
};
