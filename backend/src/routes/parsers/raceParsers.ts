import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIRequestError } from '../../errors/applicationError';
import { matchingZodSchema } from '../../utils/zodHelpers';

import type {
  APIRaceRequest,
  CreateRaceArguments,
} from '@common/types/rest_api';
import { RaceType } from '@common/types/race';


const NewRaceSchema = matchingZodSchema<APIRaceRequest<'create', CreateRaceArguments>>()(
  z.object({
    type: z.literal('create'),
    data: z.object({
      name: z.string().trim().min(4).max(128),
      type: z.nativeEnum(RaceType),
      url: z.nullable(z.string().trim().toLowerCase().min(8).max(256)),
      email: z.nullable(z.string().trim().toLowerCase().min(8).max(256).email()),
      description: z.string().trim().min(4).max(2000),
    }).strict(),
  }).strict()
);

export const newRaceParser = (
  req: Request<unknown, unknown, unknown>,
  _res: Response,
  next: NextFunction
) => {
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('', 400, { type: { _errors: ['required'] } });
    }
  }

  try {
    req.body = NewRaceSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
