import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { matchingZodSchema, zStringToDateSchema } from '../../utils/zodHelpers';
import { APIRequestError } from '../../errors/applicationError';
import type { LoggedTrailPositionAttributes } from '../../types';
import { TRAIL_CONSTANTS } from '../../constants';

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

const LoggedTrailPositionsSchema = matchingZodSchema<APITrailRequest<'appendLoggedTrailPositions', LoggedTrailPositionAttributes[]>>()(
  z.object({
    type: z.literal('appendLoggedTrailPositions'),
    data: z.array(z.object({
      clientId: z.string()
        .trim(),
      timestamp: zStringToDateSchema(),
      lat: z.number()
        .min(-90)
        .max(90),
      lon: z.number()
        .min(-180)
        .max(180),
      acc: z.number()
        .nonnegative(),
      hdg: z.number()
        .min(0)
        .max(360)
        .nullable(),
      vel: z.number()
        .nonnegative()
        .nullable(),
    }).strict())
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

export const loggedTrailPositionsParser = (
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
    req.body = LoggedTrailPositionsSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
