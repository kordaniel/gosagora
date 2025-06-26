import { Race, User } from '../models';
import { NewRaceAttributes } from '..//types';

import type { RaceListing } from '@common/types/race';

const raceListingQueryOpts = {
  attributes: ['id', 'name', 'type', 'description', 'createdAt', 'updatedAt'],
  include: {
    model: User,
    attributes: ['id', 'displayName'],
  },
};

const toRaceListing = ({ id, name, type, description, createdAt, updatedAt, user }: Race): RaceListing => ({
  id, name, type, description, createdAt, updatedAt, user: {
    id: user.id,
    displayName: user.displayName,
  },
});

const createNewRace = async (
  userId: User['id'],
  newRaceArguments: NewRaceAttributes
): Promise<RaceListing> => {
  const race = await Race.create({
    userId,
    ...newRaceArguments
  });

  await race.reload(raceListingQueryOpts);
  return toRaceListing(race);
};

const getAll = async (): Promise<RaceListing[]> => {
  const races = await Race.findAll(raceListingQueryOpts);
  return races.map(toRaceListing);
};

export default {
  createNewRace,
  getAll,
};
