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
  getUserBy,
};
