import express, {
  type Request,
  type Response,
} from 'express';

import { APIRequestError, AuthError } from '../errors/applicationError';
import middleware from '../utils/middleware';
import userService from '../services/userService';

const router = express.Router();

router.delete('/:id', middleware.userExtractor, async (
  req: Request,
  res: Response
) => {
  const userToDeleteId = parseInt(req.params.id, 10);
  if (isNaN(userToDeleteId) || userToDeleteId === 0) {
    throw new APIRequestError(`Invalid ID for user: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  await userService.deleteUser(req.user.id, userToDeleteId);
  res.status(204).end();
});

export default router;
