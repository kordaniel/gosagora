import { type UserCredential } from 'firebase/auth';

import { getTimeSpanInMsec } from './testHelpers';
import userUtils from './userUtils';

import { Race, User } from '../../src/models';

import { CreateRaceArguments } from '@common/types/rest_api';
import { RaceType } from '@common/types/race';

const baseDate = new Date();
let raceNumber: number = 0;

const getRaceCreationAttributesObject = () => {
  raceNumber++;

  return {
    name: `Test race ${raceNumber}`,
    type: RaceType.OneDesign,
    public: raceNumber % 2 === 0,
    url: `https://url.for.test-race${raceNumber}.com/`,
    email: `test@race${raceNumber}.com`,
    description: `A short description of our test race ${raceNumber}`,
    dateFrom: new Date(baseDate.getTime() + getTimeSpanInMsec(raceNumber)),
    dateTo: new Date(baseDate.getTime() + getTimeSpanInMsec(raceNumber + 1)),
    registrationOpenDate: new Date(baseDate.getTime() + getTimeSpanInMsec(raceNumber - 1)),
    registrationCloseDate: new Date(baseDate.getTime() + getTimeSpanInMsec(raceNumber)),
  };
};

const getRaceCreationArgumentsObject = (): CreateRaceArguments => {
  const {
    name, type, url, email, description,
    dateFrom, dateTo, registrationOpenDate, registrationCloseDate,
    ...rest
  } = getRaceCreationAttributesObject();
  return {
    name, type, url, email, description,
    public: rest.public,
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    registrationOpenDate: registrationOpenDate.toISOString(),
    registrationCloseDate: registrationCloseDate.toISOString(),
  };
};

const createRaces = async (): Promise<Array<{ user: User; race: Race, userCredentials: UserCredential }>> => {
  const users = await Promise.all([
    userUtils.createSignedInUser(),
    userUtils.createSignedInUser()
  ]);

  const raceCreationData = [
    getRaceCreationAttributesObject(),
    getRaceCreationAttributesObject(),
    getRaceCreationAttributesObject()
  ];

  const races = await Promise.all([
    Race.create({
      userId: users[0].user.id,
      ...raceCreationData[0],
      name: raceCreationData[0].name + '. First of first user',
      url: raceCreationData[0].url + 'user/1/first',
      email: 'first.users.first.' + raceCreationData[0].email,
    }),
    Race.create({
      userId: users[0].user.id,
      ...raceCreationData[1],
      name: raceCreationData[1].name + '. Second of first user',
      url: raceCreationData[1].url + 'user/1/second',
      email: 'first.users.second.' + raceCreationData[1].email,
    }),
    Race.create({
      userId: users[1].user.id,
      ...raceCreationData[2],
      name: raceCreationData[2].name + '. First of second user',
      url: raceCreationData[2].url + 'user/2/first',
      email: 'second.users.first.' + raceCreationData[2].email,
    })
  ]);

  return races.map((race, i) => ({
    race,
    user: users[i < 2 ? 0 : 1].user,
    userCredentials: users[i < 2 ? 0 : 1].credentials,
  }));
};

const createRace = async (
  raceCreationArguments?: { public: boolean; }
): Promise<{ user: User; race: Race, userCredentials: UserCredential }> => {
  const user = await userUtils.createSignedInUser();
  const race = await Race.create({
    userId: user.user.id,
    ...getRaceCreationAttributesObject(),
    ...raceCreationArguments,
  });
  return {
    user: user.user,
    userCredentials: user.credentials,
    race,
  };
};

export default {
  getRaceCreationArgumentsObject,
  createRace,
  createRaces,
};
