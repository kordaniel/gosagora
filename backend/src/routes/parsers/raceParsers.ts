import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import {
  getDateUTCDateOnlyOffsetDaysFromNow,
  getUTCYearLastDateOffsetYearsFromNow,
} from '../../utils/dateTools';
import {
  matchingZodSchema,
  zStringToDateSchema,
} from '../../utils/zodHelpers';
import { APIRequestError } from '../../errors/applicationError';
import { NewRaceAttributes } from '../../types';

import type { APIRaceRequest } from '@common/types/rest_api';
import { RaceType } from '@common/types/race';


const NewRaceSchema = matchingZodSchema<APIRaceRequest<'create', NewRaceAttributes>>()(
  z.object({
    type: z.literal('create'),
    data: z.object({
      name: z.string().trim().min(4).max(128),
      type: z.nativeEnum(RaceType),
      public: z.optional(z.boolean()),
      url: z.nullable(z.string().trim().toLowerCase().min(8).max(256)),
      email: z.nullable(z.string().trim().toLowerCase().min(8).max(256).email()),
      description: z.string().trim().min(4).max(2000),
      dateFrom: zStringToDateSchema({ min: getDateUTCDateOnlyOffsetDaysFromNow(-1), }, {
        min: 'Starting date can not be in the past',
      }),
      dateTo: zStringToDateSchema({ max: getUTCYearLastDateOffsetYearsFromNow(1), }, {
        max: `The end date has to be a date before Jan, 1 ${getUTCYearLastDateOffsetYearsFromNow(2).getUTCFullYear()} (UTC)`,
      }),
      registrationOpenDate: zStringToDateSchema({ min: getDateUTCDateOnlyOffsetDaysFromNow(-1), }, {
        min: 'Registration starting date can not be in the past'
      }),
      registrationCloseDate: zStringToDateSchema(), // NOTE: registrationCloseDate is refined to be <= dateTo
    }).strict(),
  }).strict()
    .refine(values => values.data.dateFrom <= values.data.dateTo, {
      message: 'End date cannot be before start date',
      path: ['data', 'dateTo'],
    })
    .refine((values) => values.data.registrationOpenDate <= values.data.dateFrom, {
      message: 'Registration close date cannot be before registration open date',
      path: ['data', 'registrationCloseDate'],
    })
    .refine((values) => values.data.registrationCloseDate <= values.data.dateTo, {
      message: 'Registration close date cannot be after race ending date',
      path: ['data', 'registrationCloseDate'],
    })
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
