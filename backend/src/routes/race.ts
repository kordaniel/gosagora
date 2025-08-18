import express, {
  type Request,
  type Response,
} from 'express';

import { APIRequestError, AuthError } from '../errors/applicationError';
import type { NewRaceAttributes, RequestUserExtended } from '../types';
import { newRaceParser, updateRaceParser } from './parsers/raceParsers';
import middleware from '../utils/middleware';
import raceService from '../services/raceService';

import type {
  APIRaceRequest,
  RaceData,
  RaceListingData,
  RacePatchResponseData
} from '@common/types/rest_api';

const router = express.Router();

router.post('/', [middleware.userExtractor, newRaceParser], async (
  req: RequestUserExtended<unknown, unknown, APIRaceRequest<'create', NewRaceAttributes>>,
  res: Response<RaceListingData>
) => {
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const newRace = await raceService.createNewRace(
    req.user.id,
    req.body.data
  );
  res.status(201).json(newRace);
});

router.get('/', async (_req: Request, res: Response<RaceListingData[]>) => {
  const races = await raceService.getAll();
  res.json(races);
});

router.get('/:id', async (req: Request, res: Response<RaceData>) => {
  const raceId = parseInt(req.params.id, 10);
  if (isNaN(raceId) || raceId === 0) {
    throw new APIRequestError(`Invalid ID for race: '${req.params.id}'`);
  }

  const race = await raceService.getOne(raceId);
  res.json(race);
});

router.delete('/:id', middleware.userExtractor, async (
  req: RequestUserExtended,
  res: Response
) => {
  const raceId = parseInt(req.params.id, 10);
  if (isNaN(raceId) || raceId === 0) {
    throw new APIRequestError(`Invalid ID for race: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  await raceService.deleteOne(req.user.id, raceId);
  res.status(204).end();
});

router.patch('/:id', [middleware.userExtractor, updateRaceParser], async (
  req: RequestUserExtended<unknown, unknown, APIRaceRequest<'update', Partial<NewRaceAttributes>>>,
  res: Response<RacePatchResponseData>
) => {
  const raceId = parseInt(req.params.id, 10);
  if (isNaN(raceId) || raceId === 0) {
    throw new APIRequestError(`Invalid ID for race: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const updatedRace = await raceService.updateRace(
    req.user.id,
    raceId,
    req.body.data
  );
  res.status(200).json(updatedRace);
});

export default router;
