import express, {
  type Request,
  type Response,
} from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

import {
  APIRequestError,
  AuthError,
  PermissionForbiddenError,
} from '../errors/applicationError';
import { newBoatParser, updateBoatParser } from './parsers/boatParsers';
import boatService from '../services/boatService';
import middleware from '../utils/middleware';

import type {
  APIBoatRequest,
  BoatCreateResponseData,
  CreateSailboatArguments,
  SailboatData,
} from '@common/types/rest_api';

const router = express.Router();

router.get('/:id', middleware.idExtractorInt, async (req: Request, res: Response<SailboatData>) => {
  if (!req.id) {
    throw new APIRequestError(`Invalid ID for boat: '${req.params.id}'`);
  }

  const boat = await boatService.getOne(req.id);
  res.json(boat);
});

router.post('/', [middleware.userExtractor, newBoatParser], async (
  req: Request<unknown, unknown, APIBoatRequest<'create', CreateSailboatArguments>>,
  res: Response<BoatCreateResponseData>
) => {
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const newBoat = await boatService.createNewBoat(
    req.user.id,
    req.body.boatType,
    req.body.data
  );

  res.status(201).json(newBoat);
});

router.patch('/:id', [
  middleware.idExtractorInt,
  middleware.userExtractor,
  updateBoatParser
], async (
  req: Request<ParamsDictionary, unknown, APIBoatRequest<'update', Partial<CreateSailboatArguments>>>,
  res: Response<BoatCreateResponseData>
) => {
  if (!req.id) {
    throw new APIRequestError(`Invalid ID for boat: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const updatedBoat = await boatService.updateBoat(
    req.user.id,
    req.id,
    req.body.data
  );
  res.status(200).json(updatedBoat);
});

router.delete('/:id/users/:userId', [
  middleware.idExtractorInt,
  middleware.userExtractor
], async (
  req: Request,
  res: Response
) => {
  if (!req.id) {
    throw new APIRequestError(`Invalid ID for boat: '${req.params.id}'`);
  }
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId === 0) {
    throw new APIRequestError(`Invalid user ID '${req.params.userId}' for boat '${req.params.id}'`);
  }

  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }
  if (req.user.id !== userId) {
    throw new PermissionForbiddenError();
  }

  await boatService.deleteUserSailboats(userId, req.id);
  res.status(204).end();
});

export default router;
