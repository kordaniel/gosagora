import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIRequestError } from '../../errors/applicationError';
import { SAILBOAT_CONSTANTS } from '../../constants';
import { matchingZodSchema } from '../../utils/zodHelpers';

import type {
  APIBoatRequest,
  CreateSailboatArguments,
} from '@common/types/rest_api';
import { BoatType } from '@common/types/boat';

const NewBoatSchema = matchingZodSchema<APIBoatRequest<'create', CreateSailboatArguments>>()(
  z.object({
    type: z.literal('create'),
    boatType: z.nativeEnum(BoatType),
    data: z.object({
      name: z.string()
        .trim()
        .min(SAILBOAT_CONSTANTS.VALIDATION.NAME_LEN.MIN)
        .max(SAILBOAT_CONSTANTS.VALIDATION.NAME_LEN.MAX),
      sailNumber: z.nullable(
        z.string()
          .trim()
          .toUpperCase()
          .min(SAILBOAT_CONSTANTS.VALIDATION.SAIL_NUMBER_LEN.MIN)
          .max(SAILBOAT_CONSTANTS.VALIDATION.SAIL_NUMBER_LEN.MAX)
      ),
      description: z.nullable(
        z.string()
          .trim()
          .min(SAILBOAT_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MIN)
          .max(SAILBOAT_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MAX)
      ),
    }).strict()
  }).strict()
);

export const newBoatParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('Post request must contain a type', 400, { type: { _errors: ['Required'] } });
    }
  }

  try {
    req.body = NewBoatSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
