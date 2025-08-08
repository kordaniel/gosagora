import express, {
  type Request,
  type Response,
} from 'express';

import { signinUserParser, signupUserParser } from './parsers/authParsers';
import authService from '../services/authService';

import type {
  APIAuthRequest,
  SignInArguments,
  SignUpArguments,
  UserDetailsData,
} from '@common/types/rest_api';

const router = express.Router();

router.post('/login', signinUserParser, async (
  req: Request<unknown, unknown, APIAuthRequest<'login', SignInArguments>>,
  res: Response<UserDetailsData>
) => {
  const user = await authService.loginUser(req.body.data);
  res.json(user);
});

router.post('/signup', signupUserParser, async (
  req: Request<unknown, unknown, APIAuthRequest<'signup', SignUpArguments>>,
  res: Response<UserDetailsData>
) => {
  const newUser = await authService.createNewUser(req.body.data);
  res.status(201).json(newUser);
});

export default router;
