import express, {
  type Request,
  type Response,
} from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

import { APIRequestError, AuthError } from '../errors/applicationError';
import { loggedTrailPositionsParser, newTrailParser } from './parsers/trailParsers';
import type { LoggedTrailPositionAttributes } from '../types';
import middleware from '../utils/middleware';
import trailService from '../services/trailService';

import type {
  APITrailRequest,
  AppendedLoggedTrailPositionData,
  CreateTrailArguments,
  TrailListingData,
} from '@common/types/rest_api';

const router = express.Router();

router.post('/', [middleware.userExtractor, newTrailParser], async (
  req: Request<unknown, unknown, APITrailRequest<'create', CreateTrailArguments>>,
  res: Response<TrailListingData>
) => {
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const newTrail = await trailService.createNewTrail(
    req.user.id,
    req.body.data
  );
  res.status(201).json(newTrail);
});

router.post('/:id/positions', [
  middleware.idExtractorInt(),
  middleware.userExtractor,
  loggedTrailPositionsParser,
], async (
  req: Request<ParamsDictionary, unknown, APITrailRequest<'appendLoggedTrailPositions', LoggedTrailPositionAttributes[]>>,
  res: Response<AppendedLoggedTrailPositionData[]>
) => {
  if (!req.parsedIds?.id) {
    throw new APIRequestError(`Invalid ID for trail: '${req.params.id}'`);
  }

  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const appendedPositions = await trailService.appendLoggedTrailPositionsToTrail(
    req.user.id,
    req.parsedIds.id,
    req.body.data
  );

  res.status(201).json(appendedPositions);
});

router.get('/', async (_req: Request, res: Response<TrailListingData[]>) => {
  const trails = await trailService.getAll();
  res.json(trails);
});

export default router;
