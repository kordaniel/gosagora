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
  user: {
    id: number;
    displayName: string;
  }
}

export interface RaceListing {
  id: number;
  name: string;
  type: RaceType;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  user: {
    id: number;
    displayName: string;
  };
}
