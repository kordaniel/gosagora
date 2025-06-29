import { useEffect } from 'react';

import type { User as FirebaseUser } from 'firebase/auth';

import {
  authSliceSetError,
  authSliceSetLoading,
  authSliceSetUser,
} from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ApplicationError } from '../errors/applicationError';
import authService from '../services/authService';
import { authSliceSetIsInitialized } from '../store/slices/authSlice';
import firebase from '../modules/firebase';

/**
 * Registers a callback for firebase auth change observer. This hook should
 * be called only once in the initialization phase and be kept mounted.
 */
const useAuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const observer = firebase.addOnAuthChangeObserver((firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        dispatch(authSliceSetUser(null));
        // NOTE:
        // If firebase auth returns a user after sign in/up, but gosagora
        // backend does not => this callback will be called with a
        // firebaseUser === null after the initial sign in attempt.
        // => The possible error message should not be cleared here.
        dispatch(authSliceSetLoading(false));
        return;
      }

      if (!firebaseUser.email) {
        console.error('SignIn, firebaseUser has no email');
        firebase.signOut().catch((signoutErr) => {
          console.error('firebase signOut error:', signoutErr);
        });
        dispatch(authSliceSetError('Unknown error happened. Please get in contact with our support team'));
        dispatch(authSliceSetLoading(false));
        return;
      }

      const userEmail = firebaseUser.email; // tell typescript this is not null

      firebaseUser.getIdToken()
        .then((idToken) => {
          authService.signInUser({
            email: userEmail,
            firebaseIdToken: idToken,
            firebaseUid: firebaseUser.uid,
          }).then(gosaGoraUser => {
            // TODO: Add response validation and parsing properties
            // to have correct types (Dates)
            dispatch(authSliceSetUser(gosaGoraUser));
            dispatch(authSliceSetError(null));
            dispatch(authSliceSetLoading(false));
          }).catch((err: unknown) => {
            // TODO: Handle backend response error message
            let errorMsg = 'SignIn error';
            if (err instanceof ApplicationError) {
              errorMsg = `${errorMsg}: ${err.message}`;
            }
            firebase.signOut().catch((signoutErr) => {
              console.error('firebase signOut error:', signoutErr);
            });
            dispatch(authSliceSetUser(null));
            dispatch(authSliceSetError(errorMsg));
            dispatch(authSliceSetLoading(false));
          });
        })
        .catch((err: unknown) => {
          // TODO: Handle firebaseUser getIdToken error
          let errorMsg = 'SignIn error';
          if (err instanceof Error) {
            errorMsg = `${errorMsg}: ${err.message}`;
          }
          firebase.signOut().catch((signoutErr) => {
            console.error('firebase signOut error:', signoutErr);
          });
          dispatch(authSliceSetUser(null));
          dispatch(authSliceSetError(errorMsg));
          dispatch(authSliceSetLoading(false));
        });
    });

    dispatch(authSliceSetIsInitialized(true));

    return observer; // TODO: if this hook ever gets unmounted => dispatch(authSliceSetIsInitialized(false)) should be called
  }, [dispatch]);
};

export default useAuthInit;
