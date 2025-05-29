import express, {
  type Response,
} from 'express';

import { Race } from '../models';
import { RequestUserExtended } from 'src/types';
import middleware from '../utils/middleware';
import { newRaceParser } from './parsers/raceParsers';
import raceService from '../services/raceService';

import type {
  APIRaceRequest,
  CreateRaceArguments,
} from '@common/types/rest_api';

const router = express.Router();

router.post('/', [middleware.userExtractor, newRaceParser], async (
  req: RequestUserExtended<unknown, unknown, APIRaceRequest<'create', CreateRaceArguments>>,
  res: Response<Race>
) => {

  if (!req.user) {
    // TODO: Fix typing for RequestUserExtended.... userExtractor throws if user is not set => req.user is always defined if this function is run
    throw new Error('baaaaad');
  }

  const newRace = await raceService.createNewRace(
    req.user.id,
    req.body.data
  );

  res.status(201).json(newRace);
});

export default router;
