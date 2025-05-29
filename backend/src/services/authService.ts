import type { DecodedIdToken } from 'firebase-admin/auth';

import { AuthError } from '../errors/applicationError';
import { User } from '../models';
import firebase from '../modules/firebase';
import logger from '../utils/logger';
import userService from './userService';

import type { SignInArguments, SignUpArguments } from '@common/types/rest_api';


const createNewUser = async (newUserArguments: SignUpArguments): Promise<User> => {
  const userRecord = await firebase.createUser(newUserArguments.email, newUserArguments.password, newUserArguments.displayName);

  if (!userRecord.email) {
    logger.error('firebase.createUser returned userRecord without email property');
    //TODO: implement firebase.deleteUser( uid )
    throw new AuthError('Unable to create user, no email');
  }
  if (!userRecord.displayName) {
    logger.error('firebase.createUser returned userRecord without displayName property');
    //TODO: implement firebase.deleteUser( uid )
    throw new Error('Unable to create user, no displayName');
  }

  const user = await userService.createNewUser({
    email: userRecord.email,
    displayName: userRecord.displayName,
    firebaseUid: userRecord.uid,
  });

  return user;
};

const loginUser = async (credentials: SignInArguments) => {
  const decodedIdToken = await verifyIdToken(credentials.firebaseIdToken);

  if (credentials.email !== decodedIdToken.email) {
    throw new AuthError();
  }
  if (credentials.firebaseUid !== decodedIdToken.uid) {
    throw new AuthError();
  }

  const user = await userService.getUserBy({ firebaseUid: decodedIdToken.uid });
  if (!user) {
    throw new AuthError('Forbidden');
  }

  await user.updateLastseen();
  return user;
};

const verifyIdToken = async (firebaseIdToken: string): Promise<DecodedIdToken> => {
  return await firebase.verifyIdToken(firebaseIdToken);
};


export default {
  createNewUser,
  loginUser,
  verifyIdToken,
};
