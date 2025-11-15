import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIRequestError } from '../../errors/applicationError';
import { TRAIL_CONSTANTS } from '../../constants';
import { matchingZodSchema } from '../../utils/zodHelpers';

import {
  APITrailRequest,
  CreateTrailArguments,
} from '@common/types/rest_api';

const NewTrailSchema = matchingZodSchema<APITrailRequest<'create', CreateTrailArguments>>()(
  z.object({
    type: z.literal('create'),
    data: z.object({
      sailboatId: z.number()
        .int()
        .nonnegative(),
      public: z.boolean().optional(),
      name: z.string()
        .trim()
        .min(TRAIL_CONSTANTS.VALIDATION.NAME_LEN.MIN)
        .max(TRAIL_CONSTANTS.VALIDATION.NAME_LEN.MAX),
      description: z.string()
        .trim()
        .min(TRAIL_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MIN)
        .max(TRAIL_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MAX),
    }).strict()
  }).strict()
);

export const newTrailParser = (
  req: Request<unknown, unknown, unknown>,
  _res: Response,
  next: NextFunction
) => {
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('Post request must contain a type', 400, { type: { _errors: ['Required'] } });
    }
  }

  try {
    req.body = NewTrailSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
