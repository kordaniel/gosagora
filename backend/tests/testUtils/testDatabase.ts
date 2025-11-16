import {
  LoggedTrailPosition,
  Race,
  Sailboat,
  Trail,
  User,
  UserSailboats,
} from '../../src/models';
import { connectToDatabase, sequelize } from '../../src/database';
import type { SailboatCreationAttributesType } from '../../src/models/sailboat';
import { UserCreationAttributesType } from '../../src/models/user';
import config from '../../src/utils/config';

import { Op } from 'sequelize';

const disconnectFromDatabase = async () => {
  await sequelize.close();
};

/**
 * https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-truncate
 * Truncate all tables defined through the sequelize models. This is done by calling Model.truncate() on each model.
 *
 * NOTE: This will truncate the migrations table as well
 */
const dropDb = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate all tables outside test environment');
  }
  await sequelize.truncate({ cascade: true, force: true, });
};

const dropUsers = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate users table outside test environment');
  }
  await User.unscoped().destroy({
    where: {},
    force: true,
  });
};

const dropLoggedTrailPositions = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate logged_trail_positions table outside test environment');
  }
  await LoggedTrailPosition.destroy({
    where: {},
    force: true,
  });
};

const dropRaces = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate races table outside test environment');
  }
  await Race.destroy({
    where: {},
    force: true,
  });
};

const dropSailboats = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate sailboats table outside test environment');
  }
  await Sailboat.destroy({
    where: {},
    force: true,
  });
};

const dropTrails = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate trails table outside test environment');
  }
  await Trail.destroy({
    where: {},
    force: true,
  });
};

const dropUserSailboats = async () => {
  if (!config.IS_TEST_ENV) {
    throw new Error('Attempted to truncate userSailboats table outside test environment');
  }
  await UserSailboats.destroy({
    where: {},
    force: true,
  });
};

const insertSailboat = async (
  attributes: SailboatCreationAttributesType,
  userId?: number
) => {
  const sailboat = await Sailboat.create(attributes);
  const userSailboats = !userId
    ? undefined
    : await UserSailboats.create({
      userId,
      sailboatId: sailboat.id,
    });

  return { sailboat, userSailboats };
};

const insertUserSailboats = async (userId: number, sailboatId: number) => {
  return await UserSailboats.create({
    userId, sailboatId,
  });
};

const insertUser = async (attributes: UserCreationAttributesType) => {
  return await User.create(attributes);
};

const insertUsers = async (attributes: UserCreationAttributesType[]) => {
  return await User.bulkCreate(attributes);
};

const userCount = async () => {
  return await User.count({});
};

const raceCount = async () => {
  return await Race.count({});
};

const sailboatCount = async () => {
  return await Sailboat.count({});
};

const trailCount = async () => {
  return await Trail.count({});
};

const loggedTrailPositionsCount = async () => {
  return await LoggedTrailPosition.count({});
};

const userSailboatsCount = async (where?: { userId?: number, sailboatId?: number }) => {
  return await UserSailboats.count(!where || Object.keys(where).length === 0 ? {} : { where });
};

//const getUsers = async () => {
//  return await User.findAll({});
//};

const getUserByFirebaseUid = async (firebaseUid: string) => {
  return await User.findOne({
    where: { firebaseUid }
  });
};

const getUserByPk = async (id: number, paranoid: boolean = true) => {
  return await User.findByPk(id, { paranoid });
};

const getRaceByPk = async (id: number, paranoid: boolean = true) => {
  return await Race.findByPk(id, { paranoid });
};

const getSailboatByPk = async (id: number, paranoid: boolean = true) => {
  return await Sailboat.findByPk(id, { paranoid });
};

const getTrailByPk = async (id: number, paranoid: boolean = true) => {
  return await Trail.findByPk(id, { paranoid });
};

const getUserSailboats = async (userId: number, sailboatId: number) => {
  return await UserSailboats.findOne({
    where: {
      userId, sailboatId,
    },
  });
};

const getRaceWhereUserIdIsNot = async (userId: number, paranoid: boolean = true) => {
  return await Race.findOne({
    where: {
      userId: {
        [Op.ne]: userId,
      },
    },
    paranoid
  });
};

export default {
  connectToDatabase,
  disconnectFromDatabase,
  dropDb,
  dropUsers,
  dropLoggedTrailPositions,
  dropRaces,
  dropSailboats,
  dropTrails,
  dropUserSailboats,
  insertSailboat,
  insertUserSailboats,
  insertUser,
  insertUsers,
  userCount,
  raceCount,
  sailboatCount,
  trailCount,
  loggedTrailPositionsCount,
  userSailboatsCount,
  //getUsers,
  getUserByFirebaseUid,
  getUserByPk,
  getRaceByPk,
  getSailboatByPk,
  getTrailByPk,
  getUserSailboats,
  getRaceWhereUserIdIsNot,
};
