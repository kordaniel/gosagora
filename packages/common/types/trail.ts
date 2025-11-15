import type { BoatIdentity } from './boat';
import type { UserIdentity } from './user';

export interface TrailListing {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date | null;
  user: UserIdentity;
  boat: BoatIdentity;
}
