import express, {
  type Response,
  type Request
} from 'express';

import { signinUserParser, signupUserParser } from '../utils/requestParsers';
import authService from '../services/authService';
import { User } from '../models';

import type {
  APIAuthRequest,
  SignInArguments,
  SignUpArguments
} from '@common/types/rest_api';

const router = express.Router();

router.post('/login', signinUserParser, async (
  req: Request<unknown, unknown, APIAuthRequest<'login', SignInArguments>>,
  res: Response<User>
) => {
  const user = await authService.loginUser(req.body.data);
  res.json(user);
});

router.post('/signup', signupUserParser, async (
  req: Request<unknown, unknown, APIAuthRequest<'signup', SignUpArguments>>,
  res: Response<User>
) => {
  const newUser = await authService.createNewUser(req.body.data);
  res.status(201).json(newUser);
});

export default router;
