import { PermissionForbiddenError } from '../errors/applicationError';
import { User } from '../models';
import type { UserCreationAttributesType } from '../models/user';

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
  const user = await User.findByPk(userToDeleteId);

  if (!user) {
    return;
  }
  if (user.id !== userId) {
    throw new PermissionForbiddenError('Forbidden: You dont have the required credentials to delete this user');
  }

  await user.destroy();
};

const getUserBy = async (
  attributes: { firebaseUid: string }
): Promise<User | null> => {
  return await User.findOne({
    where: {
      firebaseUid: attributes.firebaseUid
    }
  });
};

export default {
  createNewUser,
  deleteUser,
  getUserBy,
};
