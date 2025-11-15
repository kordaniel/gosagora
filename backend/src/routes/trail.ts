import express, {
  type Request,
  type Response,
} from 'express';

import { AuthError } from '../errors/applicationError';
import middleware from '../utils/middleware';
import { newTrailParser } from './parsers/trailParsers';
import trailService from '../services/trailService';

import type {
  APITrailRequest,
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

router.get('/', async (_req: Request, res: Response<TrailListingData[]>) => {
  const trails = await trailService.getAll();
  res.json(trails);
});

export default router;
