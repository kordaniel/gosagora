import userUtils from './userUtils';

import { Race, User } from '../../src/models';
import { RaceType } from '@common/types/race';

const createRaces = async (): Promise<Array<{ user: User; race: Race }>> => {
  const users = await Promise.all([
    userUtils.createSignedInUser(),
    userUtils.createSignedInUser()
  ]);

  const races = await Promise.all([
    Race.create({
      userId: users[0].user.id,
      type: RaceType.OneDesign,
      name: 'First test race of first user',
      description: 'First test race description',
      url: 'https://first.test.race.of.first.user.com/',
      email: 'first.test@race.com',
    }),
    Race.create({
      userId: users[0].user.id,
      type: RaceType.OneDesign,
      name: 'Second test race of first user',
      description: 'Second test race description',
      url: 'https://second.test.race.of.first.user.com/',
      email: 'second.test@race.com',
    }),
    Race.create({
      userId: users[1].user.id,
      type: RaceType.OneDesign,
      name: 'First test race of second user',
      description: 'Third race description',
      url: 'https://first.test.race.of.second.user.com/',
      email: 'third.test@race.com',
    })
  ]);

  return races.map((race, i) => ({
    race,
    user: users[i < 2 ? 0 : 1].user
  }));
};

export default {
  createRaces,
};
