import type { BoatIdentity } from './boat';
import type { UserIdentity } from './user';

export interface TrailDetails {
  id: number;
  startDate: Date;
  endDate: Date | null;
  user: UserIdentity;
  boat: BoatIdentity;
  public: boolean;
  name: string;
  description: string;
  avgVelocity: number | null;
  length: number | null;
}

export interface TrailListing {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date | null;
  user: UserIdentity;
  boat: BoatIdentity;
}
