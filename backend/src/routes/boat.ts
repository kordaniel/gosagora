import express, {
  type Request,
  type Response,
} from 'express';

import { APIRequestError, AuthError } from '../errors/applicationError';
import boatService from '../services/boatService';
import middleware from '../utils/middleware';
import { newBoatParser } from './parsers/boatParsers';

import type {
  APIBoatRequest,
  BoatCreateResponseData,
  CreateSailboatArguments,
  SailboatData,
} from '@common/types/rest_api';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response<SailboatData>) => {
  const boatId = parseInt(req.params.id, 10);
  if (isNaN(boatId) || boatId === 0) {
    throw new APIRequestError(`Invalid ID for boat: '${req.params.id}'`);
  }

  const boat = await boatService.getOne(boatId);
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

export default router;
