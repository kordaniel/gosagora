export type AssertEqual<T, U> = (
  <V>() => V extends T ? 1 : 2
) extends <V, >() => V extends U ? 1 : 2
  ? true
  : false;

export type EnvironmentType =
  | 'production'
  | 'development'
  | 'test'
  | 'test-production'; // Simulate production, with test db

export interface APIAuthRequest<
  REQT extends 'signup' | 'login',
  DT
> {
  type: REQT;
  data: DT;
}

export interface SignUpArguments {
  email: string;

   // The primary way to identify a user is by their uid, a unique identifier for that user. The Admin SDK provides a method that allows fetching the profile information of users by their uid
  firebaseUid: string;

  // ID tokens conform to the OpenID Connect spec and contain data to identify a user, as well as some other profile and authentication related information.
  // Use the ID token to securely identify the currently signed-in user on your server so you can perform server-side logic on their behalf.
  firebaseIdToken: string;
}

export interface SignInArguments {
  email: string;
  firebaseUid: string;
  firebaseIdToken: string;
}
