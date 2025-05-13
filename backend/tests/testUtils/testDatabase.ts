import { connectToDatabase, sequelize } from '../../src/database';
import { User } from '../../src/models';
import { UserCreationAttributesType } from '../../src/models/user';
import config from '../../src/utils/config';

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

const insertUser = async (attributes: UserCreationAttributesType) => {
  return await User.create(attributes);
};

const insertUsers = async (attributes: UserCreationAttributesType[]) => {
  return await User.bulkCreate(attributes);
};

const userCount = async () => {
  return await User.count({});
};

const getUserByFirebaseUid = async (firebaseUid: string) => {
  return await User.findOne({
    where: { firebaseUid }
  });
};

export default {
  connectToDatabase,
  disconnectFromDatabase,
  dropDb,
  dropUsers,
  insertUser,
  insertUsers,
  userCount,
  getUserByFirebaseUid,
};
