import { useEffect, useState } from 'react';

import { FirebaseError } from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';

import { ApplicationError } from '../errors/applicationError';
import type { User } from '../types';
import authService from '../services/authService';
import firebase from '../modules/firebase';


const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const observer = firebase.addOnAuthChangeObserver((firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      if (!firebaseUser.email) {
        console.error('SignIn, firebaseUser has no email');
        firebase.signOut().catch((signoutErr) => {
          console.error('firebase signOut error:', signoutErr);
        });
        setError('Unknown error happened. Please get in contact with our support team');
        setLoading(false);
        return;
      }

      const userEmail = firebaseUser.email;

      firebaseUser.getIdToken()
        .then((idToken) => {
          authService.signInUser({
            email: userEmail,
            firebaseIdToken: idToken,
            firebaseUid: firebaseUser.uid,
          })
            .then(gosaGoraUser => {
              setUser({ firebaseUser, gosaGoraUser });
              setError('');
              setLoading(false);
            })
            .catch((err: unknown) => {
              // TODO: Handle backend response error message
              let errorMsg = 'SignIn error';
              if (err instanceof ApplicationError) {
                errorMsg = `${errorMsg}: ${err.message}`;
              }
              firebase.signOut().catch((signoutErr) => {
                console.error('firebase signOut error:', signoutErr);
              });
              setUser(null);
              setError(errorMsg);
              setLoading(false);
            });
        })
        .catch((err: unknown) => {
          // TODO: Handle firebaseUser getIdToken error
          let errorMsg = 'SignIn error';
          if (err instanceof Error) {
            errorMsg = `${errorMsg}: ${err.message}`;
          }
          setUser(null);
          setError(errorMsg);
          setLoading(false);
        });
    });

    return observer;
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await firebase.signInWithEmailAndPassword(email, password);
    } catch (error: unknown) {
      console.log('error signin:', error);
      let errorMsg = null;
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
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
        console.log('SignIn Error:', JSON.stringify(error));
        errorMsg = 'Error at SignIn. Please try again!';
      }

      setError(errorMsg);
    }
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      await authService.signUpUser({ email, password, displayName });
      await handleSignIn(email, password);
    } catch (error: unknown) {
      // TODO: Handle backend error responses
      console.error('SignUp ERROR:', JSON.stringify(error));
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error at SignUp');
      }
    }
  };

  return {
    user,
    error,
    loading,
    handleSignIn,
    handleSignUp,
    handleSignOut: firebase.signOut,
  };
};

export default useAuth;
