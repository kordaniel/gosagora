import firebase from '../modules/firebase';
import { User } from '../models';
import userService from './userService';
import { AuthError } from '../errors/applicationError';
import type { SignInArguments, SignUpArguments } from '../types';


const createNewUser = async (newUserArguments: SignUpArguments): Promise<User> => {
  const decodedIdToken = await firebase.verifyIdToken(newUserArguments.firebaseIdToken);

  if (!decodedIdToken.email || newUserArguments.email !== decodedIdToken.email) {
    // TODO: Remove this sanity check
    console.error('emails dont match, decodedIdToken.email === undefined:', decodedIdToken.email === undefined);
    console.error('decodedEmail:', decodedIdToken.email);
    console.error('passedEmail: ', newUserArguments.email);
    throw new AuthError('Unable to create user, invalid email');
  }
  if (newUserArguments.firebaseUid !== decodedIdToken.uid) {
    // TODO: Remove this sanity check
    console.error('firebaseUids dont match');
    console.error('decodedUid:', decodedIdToken.uid);
    console.error('passedUid:', newUserArguments.firebaseUid);
    throw new AuthError('Unable to create user, invalid uid');
  }

  const user = await userService.createNewUser({
    email: decodedIdToken.email,
    firebaseUid: decodedIdToken.uid,
    lastseenAt: new Date(),
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
