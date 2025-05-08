export interface APIAuthRequest<
  REQT extends 'signup' | 'login',
  DT
> {
  type: REQT;
  data: DT;
}

/*
export interface APIUsersResonse<DT, ET> {
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
  firebaseUid: string;
  firebaseIdToken: string;
}
