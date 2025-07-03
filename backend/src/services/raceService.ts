import { type FindOptions } from 'sequelize';

import { Race, User } from '../models';
import { NewRaceAttributes } from '../types';
import { NotFoundError } from '../errors/applicationError';

import type { RaceData } from '@common/types/rest_api';
import type { RaceListing } from '@common/types/race';

const raceDataQueryOpts: FindOptions = {
  attributes: [
    'id', 'public', 'name', 'type', 'url', 'email', 'description',
    'dateFrom', 'dateTo', 'registrationOpenDate', 'registrationCloseDate',
  ],
  include: [{
    model: User,
    attributes: ['id', 'displayName']
  }],
};

const raceListingQueryOpts: FindOptions = {
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

const toRaceData = (race: Race): RaceData => {
  const fromUtcStrToISOStr = (utcDateStr: string): string => {
    const [year, month, date] = utcDateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, date)).toISOString();
  };

  return {
    id: race.id,
    public: race.public,
    name: race.name,
    type: race.type,
    url: race.url,
    email: race.email,
    description: race.description,
    dateFrom: fromUtcStrToISOStr(race.dateFrom as unknown as string),
    dateTo: fromUtcStrToISOStr(race.dateTo as unknown as string),
    registrationOpenDate: race.registrationOpenDate.toISOString(),
    registrationCloseDate: race.registrationCloseDate.toISOString(),
    user: {
      id: race.user.id,
      displayName: race.user.displayName,
    }
  };
};

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

const getOne = async (id: number): Promise<RaceData> => {
  const race = await Race.findByPk(id, raceDataQueryOpts);

  if (!race) {
    throw new NotFoundError(`Race with ID ${id} not found`);
  }

  return toRaceData(race);
};

export default {
  createNewRace,
  getAll,
  getOne,
};
