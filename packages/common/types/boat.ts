export interface BoatIdentity {
  id: number;
  name: string;
  boatType: BoatType;
}

export enum BoatType {
  Sailboat = 'SAILBOAT',
}
