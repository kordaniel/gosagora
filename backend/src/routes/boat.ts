import express, {
  type Request,
  type Response,
} from 'express';

import { APIRequestError, AuthError } from '../errors/applicationError';
import boatService from '../services/boatService';
import middleware from '../utils/middleware';

import type {
  APIBoatRequest,
  CreateSailboatArguments,
  SailboatData,
} from '@common/types/rest_api';
//import { BoatType } from '@common/types/boat';

const router = express.Router();

//router.get('/:id', (req: Request, res: Response<SailboatData>) => {
//  const boatId = parseInt(req.params.id, 10);
//  if (isNaN(boatId) || boatId === 0) {
//    throw new APIRequestError(`Invalid ID for boat: '${req.params.id}'`);
//  }
//  res.json({ id: 99999, boatType: BoatType.Sailboat, name: 'fake_test', description: null, sailNumber: null, users: [] });
//});

router.post('/', middleware.userExtractor, async (
  req: Request<unknown, unknown, APIBoatRequest<'create', CreateSailboatArguments>>,
  res: Response<SailboatData>
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
