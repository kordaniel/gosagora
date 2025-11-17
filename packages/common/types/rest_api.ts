import type { BoatIdentity, BoatType } from './boat';
import type { RaceType } from './race';
import type { UserIdentity } from './user';

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

export interface UserDetailsData {
  id: number;
  displayName: string;
  email: string;
  firebaseUid: string;
  lastseenAt: string | null;
  boatIdentities: BoatIdentity[];
}

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
  REQT extends 'create' | 'update',
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

export interface RaceListingData {
  id: number;
  name: string;
  type: RaceType;
  description: string;
  dateFrom: string;
  dateTo: string;
  user: UserIdentity;
}

export interface RaceData {
  id: number;
  public: boolean;
  name: string;
  type: RaceType;
  url: string | null;
  email: string | null;
  description: string;
  dateFrom: string;
  dateTo: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  user: UserIdentity;
};

export interface RacePatchResponseData {
  raceData: RaceData;
  raceListingData: RaceListingData;
};

export interface APIBoatRequest<
  REQT extends 'create' | 'update',
  DT
> {
  type: REQT;
  boatType: BoatType;
  data: DT;
};

export interface CreateSailboatArguments {
  name: string;
  sailNumber: string | null;
  description: string | null;
};

export interface SailboatData {
  id: number;
  boatType: BoatType.Sailboat;
  name: string;
  sailNumber: string | null;
  description: string | null;
  userIdentities: UserIdentity[];
}

export interface BoatCreateResponseData {
  boat: SailboatData;
  boatIdentity: BoatIdentity;
};

export interface APITrailRequest<
  REQT extends 'appendLoggedTrailPositions' | 'create',
  DT
> {
  type: REQT;
  data: DT;
};

export interface CreateTrailArguments {
  sailboatId: number;
  public?: boolean;
  name: string;
  description: string;
};

export interface TrailData {
  id: number;
  startDate: string;
  endDate: string | null;
  user: UserIdentity;
  boat: BoatIdentity;
  public: boolean;
  name: string;
  description: string;
  avgVelocity: number | null;
  maxVelocity: number | null;
  length: number | null;
}

export interface TrailListingData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  user: UserIdentity;
  boat: BoatIdentity;
}

export interface LoggedTrailPositionData {
  clientId: string;
  timestamp: string;
  lat: number;
  lon: number;
  acc: number;
  hdg: number | null;
  vel: number | null;
}

export interface AppendedLoggedTrailPositionData {
  id: number;
  clientId: string;
}
