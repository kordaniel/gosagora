import type { ReplaceField } from '../types';

import type {
  CreateTrailArguments,
  TrailData,
  TrailListingData,
} from "@common/types/rest_api";
import type {
  TrailDetails,
  TrailListing,
} from '@common/types/trail';

export type NewTrailValuesType = ReplaceField<
  ReplaceField<CreateTrailArguments, 'public', boolean>,
  'sailboatId', string
>;

export const toTrailDetails = (trail: TrailData): TrailDetails => ({
  ...trail,
  startDate: new Date(trail.startDate),
  endDate: trail.endDate !== null ? new Date(trail.endDate) : null,
});

export const toTrailListing = (trail: TrailListingData): TrailListing => ({
  ...trail,
  startDate: new Date(trail.startDate),
  endDate: trail.endDate !== null ? new Date(trail.endDate) : null,
});
