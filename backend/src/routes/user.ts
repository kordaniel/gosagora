import express, {
  type Response,
} from 'express';

import { APIRequestError, ServiceError } from '../errors/applicationError';
import type { RequestUserExtended } from '../types';
import middleware from '../utils/middleware';
import userService from '../services/userService';

const router = express.Router();

router.delete('/:id', middleware.userExtractor, async (
  req: RequestUserExtended,
  res: Response
) => {
  const userToDeleteId = parseInt(req.params.id, 10);
  if (isNaN(userToDeleteId) || userToDeleteId === 0) {
    throw new APIRequestError(`Invalid ID for user: '${req.params.id}'`);
  }

  if (req.user) {
    await userService.deleteUser(req.user.id, userToDeleteId);
    res.status(204).end();
  } else {
    throw new ServiceError(); // TODO: remove when typing is fixed
  }
});

export default router;
