import express, {
  type Request,
  type Response,
} from 'express';

import type { RequestUserExtended } from '../types';
import { ServiceError } from '../errors/applicationError';
import middleware from '../utils/middleware';
import { newRaceParser } from './parsers/raceParsers';
import raceService from '../services/raceService';

import type {
  APIRaceRequest,
  CreateRaceArguments,
} from '@common/types/rest_api';
import type { RaceListing } from '@common/types/race';

const router = express.Router();

router.post('/', [middleware.userExtractor, newRaceParser], async (
  req: RequestUserExtended<unknown, unknown, APIRaceRequest<'create', CreateRaceArguments>>,
  res: Response<RaceListing>
) => {
  //  // TODO: Fix typing for RequestUserExtended.... userExtractor throws if user is
  //           not set => req.user is always defined here if this function is run
  if (req.user) {
    const newRace = await raceService.createNewRace(
      req.user.id,
      req.body.data
    );
    res.status(201).json(newRace);
  } else {
    throw new ServiceError(); // TODO: remove when typing is fixed
  }
});

router.get('/', async (_req: Request, res: Response<RaceListing[]>) => {
  const races = await raceService.getAll();
  res.json(races);
});

export default router;
