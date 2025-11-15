import { DatabaseError, type FindOptions } from 'sequelize';

import { APIRequestError, PermissionForbiddenError } from '../errors/applicationError';
import { Sailboat, Trail, User } from '../models';
import boatService from './boatService';

import type {
  CreateTrailArguments,
  TrailListingData,
} from '@common/types/rest_api';

const trailListingDataQueryOpts: FindOptions = {
  attributes: ['id', 'name', 'createdAt', 'endedAt'],
  include: [
    {
      model: User,
      paranoid: false,
      attributes: ['id', 'displayName'],
    },
    {
      model: Sailboat,
      paranoid: false,
      // NOTE: boatType is a virtual field in Sailboat model => need not be specified in
      //       attributes list. Still included here to guard for future refactoring if
      //       more boat types are added.
      attributes: ['id', 'name', 'boatType'],
    },
  ],
};

const toTrailListingData = ({ id, name, createdAt, endedAt, user, sailboat }: Trail): TrailListingData => ({
  id, name,
  startDate: createdAt.toISOString(),
  endDate: endedAt ? endedAt.toISOString() : null,
  user: { // TODO: Implement virtual fields for user and boat identites, similar to sailboat model !!
    id: user.id,
    displayName: user.displayName,
  },
  boat: {
    id: sailboat.id,
    boatType: sailboat.boatType,
    name: sailboat.name,
  }
});

const createNewTrail = async (
  userId: User['id'],
  newTrailArguments: CreateTrailArguments
): Promise<TrailListingData> => {
  if (!(await boatService.userIsInUserSailboatsSet(userId, newTrailArguments.sailboatId))) {
    // NOTE: For simplicity, security and to avoid DB queries return status 403 from here in both cases, where
    //       - user has no relation to the sailboat
    //       - there exists no sailboat with the requested id (instead of 400)
    throw new PermissionForbiddenError(`Forbidden: You are not an owner of the specified boat with ID: '${newTrailArguments.sailboatId}'`);
  }

  try {
    const trail = await Trail.create({
      userId,
      sailboatId: newTrailArguments.sailboatId,
      public: newTrailArguments.public,
      name: newTrailArguments.name,
      description: newTrailArguments.description,
    });

    await trail.reload(trailListingDataQueryOpts);
    return toTrailListingData(trail);
  } catch (error: unknown) {
    if (error instanceof DatabaseError && error.name === 'SequelizeForeignKeyConstraintError') {
      // NOTE: If this is true and the if that checks userIsInUserSailboatsSet is in the start of this function
      //       => DB integrity error
      throw new APIRequestError(`Invalid ID for boat: '${newTrailArguments.sailboatId}'`);
    }
    throw error;
  }
};

const getAll = async (): Promise<TrailListingData[]> => {
  const trails = await Trail.findAll();
  return trails.map(toTrailListingData);
};

export default {
  createNewTrail,
  getAll,
};
