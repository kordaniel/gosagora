import type { RaceType } from "./race";

export interface APIAuthRequest<
  REQT extends 'signup' | 'login',
  DT
> {
  type: REQT;
  data: DT;
}

/*
export interface APIAuthResponse<DT, ET> {
  status: string; // success etc
  data?: DT;
  error?: ET;
}
*/

export interface SignUpArguments {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInArguments {
  email: string;
  // The primary way to identify a user is by their uid, a unique identifier for that user. The Admin SDK provides a method that allows fetching the profile information of users by their uid
  firebaseUid: string;
  // ID tokens conform to the OpenID Connect spec and contain data to identify a user, as well as some other profile and authentication related information.
  // Use the ID token to securely identify the currently signed-in user on your server so you can perform server-side logic on their behalf.
  firebaseIdToken: string;
}

export interface APIRaceRequest<
  REQT extends 'create',
  DT
> {
  type: REQT;
  data: DT;
};

export interface CreateRaceArguments {
  name: string;
  type: RaceType;
  public?: boolean;
  url: string | null;
  email: string | null;
  description: string;
  dateFrom: string;
  dateTo: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
};
