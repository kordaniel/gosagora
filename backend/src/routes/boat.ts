import express, {
  type Request,
  type Response,
} from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

import { APIRequestError, AuthError } from '../errors/applicationError';
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

router.patch('/:id', [middleware.userExtractor, updateBoatParser], async (
  req: Request<ParamsDictionary, unknown, APIBoatRequest<'update', Partial<CreateSailboatArguments>>>,
  res: Response<BoatCreateResponseData>
) => {
  const boatId = parseInt(req.params.id, 10);
  if (isNaN(boatId) || boatId === 0) {
    throw new APIRequestError(`Invalid ID for boat: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const updatedBoat = await boatService.updateBoat(
    req.user.id,
    boatId,
    req.body.data
  );
  res.status(200).json(updatedBoat);
});

export default router;
