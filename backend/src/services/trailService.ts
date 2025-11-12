import { type FindOptions } from 'sequelize';

import { Sailboat, Trail, User } from '../models';

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
  // TODO: Add check that sailboat with arg id exists
  //       Add tests for case when id does not exist
  console.log('newTrailArgs:', newTrailArguments);
  const trail = await Trail.create({
    userId,
    sailboatId: newTrailArguments.sailboatId,
    //public: newTrailArguments.public, // OPTIONAL, default to true
    name: newTrailArguments.name,
    description: newTrailArguments.description,
  });

  await trail.reload(trailListingDataQueryOpts);
  return toTrailListingData(trail);
};

const getAll = async (): Promise<TrailListingData[]> => {
  const trails = await Trail.findAll();
  return trails.map(toTrailListingData);
};

export default {
  createNewTrail,
  getAll,
};
