import { Race, User } from '../models';

import type { CreateRaceArguments } from '@common/types/rest_api';

const createNewRace = async (
  userId: User['id'],
  newRaceArguments: CreateRaceArguments
): Promise<Race> => {
  return await Race.create({
    userId,
    ...newRaceArguments
  });
};

export default {
  createNewRace,
};
