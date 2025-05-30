import { Race, User } from '../models';

import type { CreateRaceArguments } from '@common/types/rest_api';
import type { RaceListing } from '@common/types/race';

const createNewRace = async (
  userId: User['id'],
  newRaceArguments: CreateRaceArguments
): Promise<Race> => {
  return await Race.create({
    userId,
    ...newRaceArguments
  });
};

const getAll = async (): Promise<RaceListing[]> => {
  return await Race.findAll({
    attributes: ['id', 'name', 'type', 'description', 'createdAt', 'updatedAt'],
    include: {
      model: User,
      attributes: ['id', 'displayName'],
    },
  });
};

export default {
  createNewRace,
  getAll,
};
