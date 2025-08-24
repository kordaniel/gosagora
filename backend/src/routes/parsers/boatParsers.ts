import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIRequestError } from '../../errors/applicationError';
import { SAILBOAT_CONSTANTS } from '../../constants';
import { isEmptyObject } from '../../utils/typeguards';
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

const UpdateBoatSchema = matchingZodSchema<APIBoatRequest<'update', Partial<CreateSailboatArguments>>>()(
  z.object({
    type: z.literal('update'),
    boatType: z.nativeEnum(BoatType),
    data: z.object({
      name: z.optional(
        z.string()
          .trim()
          .min(SAILBOAT_CONSTANTS.VALIDATION.NAME_LEN.MIN)
          .max(SAILBOAT_CONSTANTS.VALIDATION.NAME_LEN.MAX)
      ),
      sailNumber: z.optional(
        z.nullable(
          z.string()
            .trim()
            .toUpperCase()
            .min(SAILBOAT_CONSTANTS.VALIDATION.SAIL_NUMBER_LEN.MIN)
            .max(SAILBOAT_CONSTANTS.VALIDATION.SAIL_NUMBER_LEN.MAX)
        ),
      ),
      description: z.optional(
        z.nullable(
          z.string()
            .trim()
            .min(SAILBOAT_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MIN)
            .max(SAILBOAT_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MAX)
        ),
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

export const updateBoatParser = (
  req: Request<unknown, unknown, APIBoatRequest<'update', Partial<CreateSailboatArguments>>>,
  _res: Response,
  next: NextFunction
) => {
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('Post request must contain a type', 400, { type: { _errors: ['Required'] } });
    }
  }

  try {
    req.body = UpdateBoatSchema.parse(req.body);
    if (isEmptyObject(req.body.data)) {
      throw new APIRequestError(
        'Patch request must contain data',
        400, {
          data: { _errors: ['Patch request data object must contain data'] }
        }
      );
    }
    next();
  } catch (error: unknown) {
    next(error);
  }
};
