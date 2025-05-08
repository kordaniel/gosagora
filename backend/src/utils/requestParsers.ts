import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import type { APIAuthRequest, SignInArguments, SignUpArguments } from '../types';
import { matchingZodSchema } from './zodHelpers';
import { APIRequestError } from '../errors/applicationError';

const SignUpUserSchema = matchingZodSchema<APIAuthRequest<'signup', SignUpArguments>>()(
  z.object({
    type: z.literal('signup'),
    data: z.object({
      email: z.string().min(8).max(256).email(),
      password: z.string().min(8).max(30),
      displayName: z.string().min(4).max(64),
    }).strict(),
  }).strict() // strict => throws when parsing if object contains additional fields
);

const SignInUserSchema = matchingZodSchema<APIAuthRequest<'login', SignInArguments>>()(
  z.object({
    type: z.literal('login'),
    data: z.object({
      email: z.string().min(8).max(256).email(),
      firebaseUid: z.string(),
      firebaseIdToken: z.string(),
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
    SignUpUserSchema.parse(req.body);
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
    SignInUserSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
