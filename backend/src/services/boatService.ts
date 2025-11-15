import { type FindOptions } from 'sequelize';

import { NotFoundError, PermissionForbiddenError } from '../errors/applicationError';
import { Sailboat, User, UserSailboats } from '../models';
import { assertNever } from '../utils/typeguards';
import { sequelize } from '../database';

import type {
  BoatCreateResponseData,
  CreateSailboatArguments,
  SailboatData,
} from '@common/types/rest_api';
import { type BoatIdentity, BoatType } from '@common/types/boat';

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
  userIdentities: sailboat.userIdentities,
});

const toBoatIdentity = (sailboat: Sailboat): BoatIdentity => ({
  id: sailboat.id,
  name: sailboat.name,
  boatType: sailboat.boatType,
});

const toBoatCreateResponseData = (sailboat: Sailboat): BoatCreateResponseData => ({
  boat: toSailboatData(sailboat),
  boatIdentity: toBoatIdentity(sailboat),
});

const createNewBoat = async (
  userId: User['id'],
  boatType: BoatType,
  newBoatArguments: CreateSailboatArguments
): Promise<BoatCreateResponseData> => {
  switch (boatType) {
    case BoatType.Sailboat: {
      const sailboat = await Sailboat.create(newBoatArguments);
      await UserSailboats.create({
        userId,
        sailboatId: sailboat.id,
      });
      await sailboat.reload(sailboatDataQueryOpts);

      return toBoatCreateResponseData(sailboat);
    }
    default: return assertNever(boatType);
  }
};

const deleteUserSailboats = async (
  userId: User['id'],
  boatId: number
): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    // NOTE: If transaction fails => sequelize will rollback the transaction and throw
    const userSailboats = await UserSailboats.findOne({
      where: { userId, sailboatId: boatId, },
      transaction,
    });

    if (userSailboats) {
      await userSailboats.destroy({ transaction });
    } else {
      const sailboat = await Sailboat.findOne({
        where: { id: boatId },
        attributes: ['id'],
      });
      if (sailboat) {
        // Sailboat exists but user has no relation mapped to it
        throw new PermissionForbiddenError();
        // NOTE: Depending on the count of rows in the junction table where sailboatId = boatId, the
        //       delete query can either remove a mapping OR delete the only mapping and the sailboat
        //       => use default 403 message
      }
    }
  });
};

const getOne = async (id: number): Promise<SailboatData> => {
  const boat = await Sailboat.findByPk(id, sailboatDataQueryOpts);

  if (!boat) {
    throw new NotFoundError(`Boat with ID ${id} was not found`);
  }

  return toSailboatData(boat);
};

const updateBoat = async (
  userId: User['id'],
  boatId: number,
  updatedFields: Partial<CreateSailboatArguments>
): Promise<BoatCreateResponseData> => {
  const sailboat = await Sailboat.findByPk(boatId, sailboatDataQueryOpts);

  if (!sailboat) {
    throw new NotFoundError(`Boat with ID ${boatId} was not found`);
  }
  if (!sailboat.userIdentities.some(u => u.id === userId)) {
    throw new PermissionForbiddenError('Forbidden: You dont have the required credentials to update this boat');
  }

  sailboat.set(updatedFields);
  await sailboat.save();

  return toBoatCreateResponseData(sailboat);
};

const userIsInUserSailboatsSet = async (
  userId: User['id'],
  boatId: number
): Promise<boolean> => {
  // NOTE: count always scans whole table, findOne stops when first matching row is found
  const userSailboats = await UserSailboats.findOne({
    attributes: ['userId'],
    where: { userId, sailboatId: boatId, },
  });
  return userSailboats !== null;
};

export default {
  createNewBoat,
  deleteUserSailboats,
  getOne,
  updateBoat,
  userIsInUserSailboatsSet,
};
