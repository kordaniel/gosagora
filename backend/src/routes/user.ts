import express, {
  type Request,
  type Response,
} from 'express';

import { APIRequestError, AuthError } from '../errors/applicationError';
import middleware from '../utils/middleware';
import userService from '../services/userService';

const router = express.Router();

router.delete('/:id', [
  middleware.idExtractorInt,
  middleware.userExtractor
], async (
  req: Request,
  res: Response
) => {
  if (!req.id) {
    throw new APIRequestError(`Invalid ID for user: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  await userService.deleteUser(req.user.id, req.id);
  res.status(204).end();
});

export default router;
