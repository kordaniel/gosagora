import express, {
  type Request,
  type Response,
} from 'express';

import { APIRequestError, ServiceError } from '../errors/applicationError';
import type { NewRaceAttributes, RequestUserExtended } from '../types';
import middleware from '../utils/middleware';
import { newRaceParser } from './parsers/raceParsers';
import raceService from '../services/raceService';

import type { APIRaceRequest, RaceData } from '@common/types/rest_api';
import type { RaceListing } from '@common/types/race';

const router = express.Router();

router.post('/', [middleware.userExtractor, newRaceParser], async (
  req: RequestUserExtended<unknown, unknown, APIRaceRequest<'create', NewRaceAttributes>>,
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

router.get('/:id', async (req: Request, res: Response<RaceData>) => {
  const raceId = parseInt(req.params.id, 10);
  if (isNaN(raceId) || raceId === 0) {
    throw new APIRequestError(); // TODO: Add message
  }

  const race = await raceService.getOne(raceId);

  res.json(race);
});

router.delete('/:id', middleware.userExtractor, async (
  req: RequestUserExtended,
  res: Response
) => {
  //  // TODO: Fix typing for RequestUserExtended.... userExtractor throws if user is
  //           not set => req.user is always defined here if this function is run
  if (req.user) {
    const raceId = parseInt(req.params.id, 10);
    await raceService.deleteOne(req.user.id, raceId);
    res.status(204).end();
  } else {
    throw new ServiceError(); // TODO: remove when typing is fixed
  }
});

export default router;
