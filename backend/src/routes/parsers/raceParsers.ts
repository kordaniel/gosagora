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
import { RACE_CONSTANTS } from '../../constants';
import { isEmptyObject } from '../../utils/typeguards';

import type { APIRaceRequest } from '@common/types/rest_api';
import { RaceType } from '@common/types/race';


const NewRaceSchema = matchingZodSchema<APIRaceRequest<'create', NewRaceAttributes>>()(
  z.object({
    type: z.literal('create'),
    data: z.object({
      name: z.string().trim().min(RACE_CONSTANTS.NAME_LEN.MIN).max(RACE_CONSTANTS.NAME_LEN.MAX),
      type: z.nativeEnum(RaceType),
      public: z.optional(z.boolean()),
      url: z.nullable(z.string().trim().toLowerCase().min(RACE_CONSTANTS.URL_LEN.MIN).max(RACE_CONSTANTS.URL_LEN.MAX)),
      email: z.nullable(z.string().trim().toLowerCase().min(RACE_CONSTANTS.EMAIL_LEN.MIN).max(RACE_CONSTANTS.EMAIL_LEN.MAX).email()),
      description: z.string().trim().min(RACE_CONSTANTS.DESCRIPTION_LEN.MIN).max(RACE_CONSTANTS.DESCRIPTION_LEN.MAX),
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
      message: 'Registration open date cannot be after race starting date',
      path: ['data', 'registrationOpenDate'],
    })
    .refine((values) => values.data.registrationCloseDate <= values.data.dateTo, {
      message: 'Registration close date cannot be after race ending date',
      path: ['data', 'registrationCloseDate'],
    })
);

const UpdateRaceSchema = matchingZodSchema<APIRaceRequest<'update', Partial<NewRaceAttributes>>>()(
  z.object({
    type: z.literal('update'),
    data: z.object({
      name: z.optional(z.string().trim().min(RACE_CONSTANTS.NAME_LEN.MIN).max(RACE_CONSTANTS.NAME_LEN.MAX)),
      type: z.optional(z.nativeEnum(RaceType)),
      public: z.optional(z.boolean()),
      url: z.optional(z.nullable(z.string().trim().toLowerCase().min(RACE_CONSTANTS.URL_LEN.MIN).max(RACE_CONSTANTS.URL_LEN.MAX))),
      email: z.optional(z.nullable(z.string().trim().toLowerCase().min(RACE_CONSTANTS.EMAIL_LEN.MIN).max(RACE_CONSTANTS.EMAIL_LEN.MAX).email())),
      description: z.optional(z.string().trim().min(RACE_CONSTANTS.DESCRIPTION_LEN.MIN).max(RACE_CONSTANTS.DESCRIPTION_LEN.MAX)),
      dateFrom: z.optional(zStringToDateSchema({ min: getDateUTCDateOnlyOffsetDaysFromNow(-1), }, {
        min: 'Starting date can not be in the past',
      })),
      dateTo: z.optional(zStringToDateSchema({ max: getUTCYearLastDateOffsetYearsFromNow(1), }, {
        max: `The end date has to be a date before Jan, 1 ${getUTCYearLastDateOffsetYearsFromNow(2).getUTCFullYear()} (UTC)`,
      })),
      registrationOpenDate: z.optional(zStringToDateSchema({ min: getDateUTCDateOnlyOffsetDaysFromNow(-1), }, {
        min: 'Registration starting date can not be in the past'
      })),
      registrationCloseDate: z.optional(zStringToDateSchema()), // NOTE: registrationCloseDate is refined to be <= dateTo
    }).strict(),
  }).strict()
    .refine(values => {
      if (
        values.data.dateFrom ||
        values.data.dateTo ||
        values.data.registrationOpenDate ||
        values.data.registrationCloseDate
      ) {
        return values.data.dateFrom
          && values.data.dateTo
          && values.data.registrationOpenDate
          && values.data.registrationCloseDate;
      }
      return true;
    }, {
      message: 'Invalid datetime fields: either provide all or none',
      path: ['data'],
    })
    .refine(values => {
      if (!(values.data.dateFrom && values.data.dateTo)) {
        return true;
      }
      return values.data.dateFrom <= values.data.dateTo;
    }, {
      message: 'End date cannot be before start date',
      path: ['data', 'dateTo'],
    })
    .refine((values) => {
      if (!(values.data.registrationOpenDate && values.data.dateFrom)) {
        return true;
      }
      return values.data.registrationOpenDate <= values.data.dateFrom;
    }, {
      message: 'Registration open date cannot be after race starting date',
      path: ['data', 'registrationOpenDate'],
    })
    .refine((values) => {
      if (!(values.data.registrationCloseDate && values.data.dateTo)) {
        return true;
      }
      return values.data.registrationCloseDate <= values.data.dateTo;
    }, {
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
      throw new APIRequestError('Post request must contain a type', 400, { type: { _errors: ['Required'] } });
    }
  }

  try {
    req.body = NewRaceSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const updateRaceParser = (
  req: Request<unknown, unknown, Partial<APIRaceRequest<'update', Partial<NewRaceAttributes>>>>,
  _res: Response,
  next: NextFunction
) => {
  // TODO: type req.body correctly
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('Patch request must contain a type', 400, { type: { _errors: ['Required'] } });
    }
  }

  try {
    req.body = UpdateRaceSchema.parse(req.body);
    // req.body.type === 'update' && req.body.data is now defined
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
