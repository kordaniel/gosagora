import express, {
  type Request,
  type Response,
} from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

import { APIRequestError, AuthError } from '../errors/applicationError';
import { newRaceParser, updateRaceParser } from './parsers/raceParsers';
import type { NewRaceAttributes } from '../types';
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
  req: Request<unknown, unknown, APIRaceRequest<'create', NewRaceAttributes>>,
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

router.get('/:id', middleware.idExtractorInt(), async (req: Request, res: Response<RaceData>) => {
  if (!req.parsedIds?.id) {
    throw new APIRequestError(`Invalid ID for race: '${req.params.id}'`);
  }

  const race = await raceService.getOne(req.parsedIds.id);
  res.json(race);
});

router.delete('/:id', [
  middleware.idExtractorInt(),
  middleware.userExtractor
], async (
  req: Request,
  res: Response
) => {
  if (!req.parsedIds?.id) {
    throw new APIRequestError(`Invalid ID for race: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  await raceService.deleteOne(req.user.id, req.parsedIds.id);
  res.status(204).end();
});

router.patch('/:id', [
  middleware.idExtractorInt(),
  middleware.userExtractor,
  updateRaceParser
], async (
  req: Request<ParamsDictionary, unknown, APIRaceRequest<'update', Partial<NewRaceAttributes>>>,
  res: Response<RacePatchResponseData>
) => {
  if (!req.parsedIds?.id) {
    throw new APIRequestError(`Invalid ID for race: '${req.params.id}'`);
  }
  if (!req.user) {
    throw new AuthError('Forbidden: invalid user', 403);
  }

  const updatedRace = await raceService.updateRace(
    req.user.id,
    req.parsedIds.id,
    req.body.data
  );
  res.status(200).json(updatedRace);
});

export default router;
