import { type FindOptions } from 'sequelize';

import { Sailboat, User, UserSailboats } from '../models';
import { NotFoundError } from '../errors/applicationError';
import { assertNever } from '../utils/typeguards';

import type {
  CreateSailboatArguments,
  SailboatData,
} from '@common/types/rest_api';
import { BoatType } from '@common/types/boat';

const sailboatDataQueryOpts: FindOptions = {
  attributes: [ 'id', 'name', 'sailNumber', 'description' ],
  include: {
    model: User,
    attributes: ['id', 'displayName'],
  },
};

const toSailboatData = (sailboat: Sailboat): SailboatData => ({
  id: sailboat.id,
  boatType: sailboat.boatType,
  name: sailboat.name,
  description: sailboat.description,
  sailNumber: sailboat.sailNumber,
  users: sailboat.users
    ? sailboat.users.map(({ id, displayName }) => ({ id, displayName }))
    : [],
});

const createNewBoat = async (
  userId: User['id'],
  boatType: BoatType,
  newBoatArguments: CreateSailboatArguments
): Promise<SailboatData> => {
  switch (boatType) {
    case BoatType.Sailboat: {
      const sailboat = await Sailboat.create(newBoatArguments);
      await UserSailboats.create({
        userId,
        sailboatId: sailboat.id,
      });
      await sailboat.reload(sailboatDataQueryOpts);

      return toSailboatData(sailboat);
    }
    default: return assertNever(boatType);
  }
};

//const getOne = async (id: number): Promise<SailboatData> => {
//  const boat = await Sailboat.findByPk(id, sailboatDataQueryOpts);
//
//  if (!boat) {
//    throw new NotFoundError(`Boat with ID ${id} not found`);
//  }
//
//  return toSailboatData(boat);
//};

export default {
  createNewBoat,
  //getOne,
};
