import firebase from '../modules/firebase';
import { User } from '../models';
import userService from './userService';
import { AuthError } from '../errors/applicationError';
import type { SignInArguments, SignUpArguments } from '../types';
import logger from '../utils/logger';


const createNewUser = async (newUserArguments: SignUpArguments): Promise<User> => {
  const userRecord = await firebase.createUser(newUserArguments.email, newUserArguments.password, newUserArguments.displayName);

  if (!userRecord.email) {
    logger.error('firebase.createUser returned userRecord without email property');
    throw new AuthError('Unable to create user, no email');
  }
  if (!userRecord.displayName) {
    logger.error('firebase.createUser returned userRecord without displayName property');
    throw new Error('Unable to create user, no displayName');
  }

  const user = await userService.createNewUser({
    email: userRecord.email,
    displayName: userRecord.displayName,
    firebaseUid: userRecord.uid
  });

  return user;
};

const loginUser = async (credentials: SignInArguments) => {
  const decodedIdToken = await firebase.verifyIdToken(credentials.firebaseIdToken);

  if (credentials.email !== decodedIdToken.email) {
    // TODO: Remove this sanity check
    console.error('emails dont match, decodedIdToken.email === undefined:', decodedIdToken.email === undefined);
    console.error('decodedEmail:', decodedIdToken.email);
    console.error('passedEmail: ', credentials.email);
    throw new AuthError('Unable to perform login, invalid email');
  }
  if (credentials.firebaseUid !== decodedIdToken.uid) {
    // TODO: Remove this sanity check
    console.error('firebaseUids dont match');
    console.error('decodedUid:', decodedIdToken.uid);
    console.error('passedUid:', credentials.firebaseUid);
    throw new AuthError('Unable to perform login, invalid uid');
  }

  const user = await userService.getUserBy({ firebaseUid: decodedIdToken.uid });
  if (!user) {
    throw new AuthError('User not found');
  }

  await user.updateLastseen();
  return user;
};


export default {
  createNewUser,
  loginUser,
};
