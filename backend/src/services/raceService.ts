import { type FindOptions } from 'sequelize';

import {
  NotFoundError,
  PermissionForbiddenError,
} from '../errors/applicationError';
import { Race, User } from '../models';
import { type NewRaceAttributes } from '../types';

import type {
  RaceData,
  RaceListingData,
  RacePatchResponseData,
} from '@common/types/rest_api';

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

const raceListingDataQueryOpts: FindOptions = {
  attributes: ['id', 'name', 'type', 'description', 'dateFrom', 'dateTo'],
  include: {
    model: User,
    attributes: ['id', 'displayName'],
  },
};

const fromUtcStrToISOStr = (utcDateStr: string): string => {
  const [year, month, date] = utcDateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date)).toISOString();
};

const toRaceListingData = ({ id, name, type, description, dateFrom, dateTo, user }: Race): RaceListingData => ({
  id, name, type, description,
  dateFrom: fromUtcStrToISOStr(dateFrom as unknown as string),
  dateTo: fromUtcStrToISOStr(dateTo as unknown as string),
  user: {
    id: user.id,
    displayName: user.displayName,
  },
});

const toRaceData = (race: Race): RaceData => ({
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
});

const createNewRace = async (
  userId: User['id'],
  newRaceArguments: NewRaceAttributes
): Promise<RaceListingData> => {
  const race = await Race.create({
    userId,
    ...newRaceArguments
  });

  await race.reload(raceListingDataQueryOpts);
  return toRaceListingData(race);
};

const deleteOne = async (
  userId: User['id'],
  raceId: number
): Promise<void> => {
  const race = await Race.findByPk(raceId);

  if (!race) {
    return;
  }
  if (race.userId !== userId) {
    throw new PermissionForbiddenError('Forbidden: You dont have the required credentials to delete this race');
  }

  await race.destroy();
};

const getAll = async (): Promise<RaceListingData[]> => {
  const races = await Race.findAll(raceListingDataQueryOpts);
  return races.map(toRaceListingData);
};

const getOne = async (id: number): Promise<RaceData> => {
  const race = await Race.findByPk(id, raceDataQueryOpts);

  if (!race) {
    throw new NotFoundError(`Race with ID ${id} not found`);
  }

  return toRaceData(race);
};

const updateRace = async (
  userId: User['id'],
  raceId: number,
  updatedFields: Partial<NewRaceAttributes>
): Promise<RacePatchResponseData> => {
  const race = await Race.findByPk(raceId);

  if (!race) {
    throw new NotFoundError(`Race with ID ${raceId} not found`);
  }
  if (race.userId !== userId) {
    throw new PermissionForbiddenError('Forbidden: You dont have the required credentials to update this race');
  }

  race.set(updatedFields);
  await race.save();
  await race.reload(raceDataQueryOpts);

  return {
    raceData: toRaceData(race),
    raceListingData: toRaceListingData(race),
  };
};

export default {
  createNewRace,
  deleteOne,
  getAll,
  getOne,
  updateRace,
};
