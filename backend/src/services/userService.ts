import { type FindOptions, type InferAttributes } from 'sequelize';

import { Sailboat, User } from '../models';
import { PermissionForbiddenError } from '../errors/applicationError';
import type { UserCreationAttributesType } from '../models/user';
import { sequelize } from '../database';

const userDetailsDataQueryOpts: FindOptions<InferAttributes<User, { omit: never; }>> = {
  attributes: ['id', 'displayName', 'email', 'firebaseUid', 'lastseenAt'],
  include: [{
    model: Sailboat,
    paranoid: false,
    attributes: ['id', 'name', 'boatType']
  }],
};

const createNewUser = async (
  newUserArguments: UserCreationAttributesType
): Promise<User> => {
  return await User.create({
    email: newUserArguments.email,
    displayName: newUserArguments.displayName,
    firebaseUid: newUserArguments.firebaseUid,
  });
};

const deleteUser = async (
  userId: User['id'],
  userToDeleteId: User['id']
): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    // NOTE: If transaction fails => sequelize will rollback the transaction and throw
    const user = await User.findByPk(userToDeleteId, {
      attributes: ['id'],
      transaction,
    });

    if (!user) {
      return;
    }
    if (user.id !== userId) {
      throw new PermissionForbiddenError('Forbidden: You dont have the required credentials to delete this user');
    }

    await user.destroy({ transaction });
  });
};

const getUserByFirebaseUid = async (firebaseUid: string): Promise<User | null> => {
  return await User.findOne({ where: { firebaseUid } });
};

const getUserDetailsDataByFirebaseUid = async (firebaseUid: string) => {
  return await User.findOne({
    ...userDetailsDataQueryOpts,
    where: { firebaseUid }
  });
};

export default {
  createNewUser,
  deleteUser,
  getUserByFirebaseUid,
  getUserDetailsDataByFirebaseUid,
};
