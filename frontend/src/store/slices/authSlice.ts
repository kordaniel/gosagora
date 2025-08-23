import {
  type PayloadAction,
  createSlice
} from '@reduxjs/toolkit';
import { FirebaseError } from 'firebase/app';

import type { AppAsyncThunk, RootState } from '../index';
import { type UserDetails, toUserDetails } from '../../models/user';
import { ApplicationError } from '../../errors/applicationError';
import { ReplaceField } from '../../types';
import authService from '../../services/authService';
import firebase from '../../modules/firebase';
import userService from '../../services/userService';

import type { BoatIdentity } from '@common/types/boat';
import type { UserDetailsData } from '@common/types/rest_api';

/**
 * !!! NOTE: The possible error strings that are set in the
 * !!! thunk functions of this module are cleared in the firebase
 * !!! authChange observer callback, which is defined and registered
 * !!! in hooks/useAuthInit.
 */

export interface AuthState {
  user: UserDetailsData | null;
  error: string | null;
  isInitialized: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  error: null,
  isInitialized: false,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUserBoatIdentity: (state, action: PayloadAction<BoatIdentity>) => {
      if (state.user) {
        state.user.boatIdentities = state.user.boatIdentities.concat(action.payload);
      }
    },
    setUser: (state, action: PayloadAction<UserDetailsData | null>) => {
      state.user = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addUserBoatIdentity: authSliceAddUserBoatIdentity,
  setUser: authSliceSetUser,
  setError: authSliceSetError,
  setIsInitialized: authSliceSetIsInitialized,
  setLoading: authSliceSetLoading,
} = authSlice.actions;

export const SelectAuth = (state: RootState): ReplaceField<AuthState, 'user', UserDetails | null> & {
  isAuthenticated: boolean;
} => ({
  ...state.auth,
  user: state.auth.user ? toUserDetails(state.auth.user) : null,
  isAuthenticated: !state.auth.loading && state.auth.user !== null,
});


export const authSliceHandleSignIn = (email: string, password: string): AppAsyncThunk => {
  return async (dispatch, getState) => {
    if (!SelectAuth(getState()).loading) {
      // is already in loading state if this func is called from authSliceHandleSignUp
      dispatch(authSliceSetLoading(true));
    }

    try {
      await firebase.signInWithEmailAndPassword(email.trim(), password.trim());
    } catch (error: unknown) {
      console.error('error signing in:', error);
      let errorMsg: string;

      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/missing-password'
        ) {
          errorMsg = 'Incorrect email or password. Please try again!';
        } else if (error.code === 'auth/network-request-failed') {
          errorMsg = 'Network error. Please try again in a moment';
        } else {
          console.log('name:', error.name);
          console.log('code:', error.code);
          console.log('mesg:', error.message);
          errorMsg = 'Unknown error. Please try again!';
        }
      } else {
        console.log('unhandled error signing in:', JSON.stringify(error));
        errorMsg = 'Unknown error. Please try again!';
      }

      dispatch(authSliceSetError(errorMsg));
    }
  };
};

export const authSliceHandleSignUp = (
  email: string,
  password: string,
  displayName: string
): AppAsyncThunk => {
  return async (dispatch, getState) => {
    if (SelectAuth(getState()).error) {
      dispatch(authSliceSetError(null));
    }

    if (email !== email.trim()) {
      dispatch(authSliceSetError('Your email address can not contain any spaces. Please try again'));
      return;
    }
    if (displayName !== displayName.trim()) {
      dispatch(authSliceSetError('Your Visible Name can not start or end with spaces. Please try again'));
      return;
    }
    if (password !== password.trim()) {
      dispatch(authSliceSetError('Your Password can not start or end with spaces. Please try again'));
      return;
    }

    dispatch(authSliceSetLoading(true));

    try {
      await authService.signUpUser({ email, password, displayName });
      await dispatch(authSliceHandleSignIn(email, password));
    } catch (error: unknown) {
      console.error('signup error:', error);
      if (error instanceof ApplicationError) {
        dispatch(authSliceSetError(error.message));
      } else {
        console.error('signup error was unhandled');
      }
    }
  };
};

export const authSliceDeleteUser = (password: string): AppAsyncThunk<string | null> => {
  return async (dispatch, getState) => {
    const authState = getState();

    if (!SelectAuth(authState).isAuthenticated) {
      return 'Please Sign In to perform this action';
    }

    const userId = SelectAuth(authState).user?.id; // user !== null if isAuthenticated
    if (!userId) {
      return 'We ran into a problem while deleting your profile. Please try again, or contact our support team if the problem persists';
    }

    try {
      await firebase.verifyCurrentUserPassword(password.trim());
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === 'auth/wrong-password') {
        return 'Incorrect password. Please try again!';
      } else if (error instanceof Error) {
        console.log('gen err:', error.message);
        return error.message;
      } else {
        console.log('unhandled error at DeleteUser passwd confirmation:', error);
        return 'Unknown error happened. Please try again!';
      }
    }

    try {
      await userService.deleteOne(userId.toString());
      dispatch(authSliceSetLoading(true));
      await firebase.signOut();
      return null;
    } catch (error: unknown) {
      dispatch(authSliceSetLoading(false));
      if (error instanceof ApplicationError) {
        return error.message;
      } else {
        console.error('unhandled error at DeleteUser:', error);
        return 'Unknown error happened. Please try again!';
      }
    }
  };
};

export default authSlice.reducer;
