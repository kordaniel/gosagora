import { FirebaseError, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword, // => Promise<UserCredential>
  signOut
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

import type { SignInValuesType } from '../pages/Authentication/SignIn';
import konffi from '../utils/firebaseConfig';

console.log('konffi:', konffi);


/**
 * https://firebase.google.com/docs/web/learn-more#config-object
 * Note: The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
 * Visit [Understand Firebase Projects](https://firebase.google.com/docs/projects/learn-more#config-files-objects)
 * to learn more about this config object.
 */


const firebaseApp  = initializeApp(konffi);
//const firebaseAuth = getAuth(firebaseApp);
const auth = getAuth();

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        console.log('user is signed in:', user);

        //sendEmailVerification(user)
        //  .then((res) => {
        //    console.log('email sent..:', res);
        //  })
        //  .catch((err) => {
        //    console.log('error sending email:', err);
        //  });

        //const displayName = user.displayName;
        //const email = user.email;
        //const photoURL = user.photoURL;
        //const emailVerified = user.emailVerified;

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        //const uid = user.uid;

        //console.log('displayName:', displayName);
        //console.log('email:', email);
        //console.log('photoURL:',photoURL );
        //console.log('emailVerified:', emailVerified);
        //console.log('uid:', uid);
        console.log('idToken:', user.getIdToken());

        //console.log('provider-specified data:');
        //user.providerData.forEach((profile) => {
        //  console.log("Sign-in provider: " + profile.providerId);
        //  console.log("  Provider-specific UID: " + profile.uid);
        //  console.log("  Name: " + profile.displayName);
        //  console.log("  Email: " + profile.email);
        //  console.log("  Photo URL: " + profile.photoURL);
        //});
        setUser(user);
      } else {
        console.log('no user');
        setUser(null);
      }
    });

    return observer;
  }, []);

  const handleSignIn = async (credentials: SignInValuesType) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      console.log('signed in:', userCredentials);
      console.log('signed in user is:', userCredentials.user);
      console.log('idToken:', await userCredentials.user.getIdToken());
    } catch (error: unknown) { // Warning: An unhandled error was caught from submitForm() FirebaseError: Firebase: Error (auth/invalid-credential).
      if (error instanceof FirebaseError) {
        console.log('name:', error.name); // name: FirebaseError
        console.log('code:', error.code); // code: auth/invalid-credential
        console.log('mesg:', error.message); // mesg: Firebase: Error (auth/invalid-credential)
      } else {
        console.log('error:', JSON.stringify(error));
      }
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('signed up:', userCredential);
      console.log('signed up user is:', userCredential.user);
      console.log('idToken:', await userCredential.user.getIdToken());
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log('name:', error.name); // name: FirebaseError
        console.log('code:', error.code); // code: auth/email-already-in-use
        console.log('mesg:', error.message); // mesg: Firebase: Error (auth/email-already-in-use).
      } else {
        console.log('error:', JSON.stringify(error));
      }
    }
  };

  const handleSignOut = async () => {
    console.log('Signing out');
    await signOut(auth);
  };

  return {
    user,
    handleSignIn,
    handleSignUp,
    handleSignOut,
  };
};

export default useAuth;
