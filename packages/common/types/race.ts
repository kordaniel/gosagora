export enum RaceType {
  OneDesign = 'ONE_DESIGN',
}

export interface RaceListing {
  id: number;
  name: string;
  type: RaceType;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    displayName: string;
  };
}
