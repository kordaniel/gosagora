import { ZodType, type ZodTypeDef } from 'zod';
import type { AssertEqual } from '../types';

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
  <S extends ZodType<T, ZodTypeDef, unknown>>(
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
