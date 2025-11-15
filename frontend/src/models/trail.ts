import type { ReplaceField } from '../types';

import type {
  CreateTrailArguments,
  TrailListingData,
} from "@common/types/rest_api";
import type {
  TrailListing,
} from '@common/types/trail';

export type NewTrailValuesType = ReplaceField<
  ReplaceField<CreateTrailArguments, 'public', boolean>,
  'sailboatId', string
>;

export const toTrailListing = (trail: TrailListingData): TrailListing => ({
  ...trail,
  startDate: new Date(trail.startDate),
  endDate: trail.endDate !== null ? new Date(trail.endDate) : null,
});
