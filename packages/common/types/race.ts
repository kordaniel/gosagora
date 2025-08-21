import type { UserIdentity } from './user';

export enum RaceType {
  OneDesign = 'ONE_DESIGN',
}

export interface RaceDetails {
  id: number;
  public: boolean;
  name: string;
  type: RaceType;
  url: string | null;
  email: string | null;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  registrationOpenDate: Date;
  registrationCloseDate: Date;
  user: UserIdentity;
}

export interface RaceListing {
  id: number;
  name: string;
  type: RaceType;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  user: UserIdentity;
}
