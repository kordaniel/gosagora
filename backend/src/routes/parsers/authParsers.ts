import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIRequestError } from '../../errors/applicationError';
import { USER_CONSTANTS } from '../../constants';
import { matchingZodSchema } from '../../utils/zodHelpers';

import type {
  APIAuthRequest,
  SignInArguments,
  SignUpArguments
} from '@common/types/rest_api';


const SignUpUserSchema = matchingZodSchema<APIAuthRequest<'signup', SignUpArguments>>()(
  z.object({
    type: z.literal('signup'),
    data: z.object({
      email: z.string().trim().toLowerCase().min(USER_CONSTANTS.EMAIL_LEN.MIN).max(USER_CONSTANTS.EMAIL_LEN.MAX).email(),
      password: z.string().trim().min(USER_CONSTANTS.PASSWORD_LEN.MIN).max(USER_CONSTANTS.PASSWORD_LEN.MAX),
      displayName: z.string().trim().min(USER_CONSTANTS.DISPLAY_NAME_LEN.MIN).max(USER_CONSTANTS.DISPLAY_NAME_LEN.MAX),
    }).strict(),
  }).strict() // strict => throws when parsing if object contains additional fields
);

const SignInUserSchema = matchingZodSchema<APIAuthRequest<'login', SignInArguments>>()(
  z.object({
    type: z.literal('login'),
    data: z.object({
      email: z.string().trim().toLowerCase().min(USER_CONSTANTS.EMAIL_LEN.MIN).max(USER_CONSTANTS.EMAIL_LEN.MAX).email(),
      firebaseUid: z.string().trim(),
      firebaseIdToken: z.string().trim(),
    }).strict(),
  }).strict() // strict => throws when parsing if object contains additional fields
);


export const signupUserParser = (
  req: Request<unknown, unknown, unknown>,
  _res: Response,
  next: NextFunction
) => {
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('', 400, { type: { _errors: ['required'] } });
    }

    const parsedReqType = SignUpUserSchema.shape.type.safeParse(req.body.type);
    if (!parsedReqType.success) {
      throw new APIRequestError('', 400, { type: parsedReqType.error.format() });
    }
  }

  try {
    req.body = SignUpUserSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const signinUserParser = (
  req: Request<unknown, unknown, unknown>,
  _res: Response,
  next: NextFunction
) => {
  if (req.body instanceof Object) {
    if (!('type' in req.body)) {
      throw new APIRequestError('', 400, { type: { _errors: ['required'] } });
    }

    const parsedReqType = SignInUserSchema.shape.type.safeParse(req.body.type);
    if (!parsedReqType.success) {
      throw new APIRequestError('', 400, { type: parsedReqType.error.format() });
    }
  }

  try {
    req.body = SignInUserSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
