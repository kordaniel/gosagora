import type { ReplaceField } from '../types';

import type { CreateTrailArguments } from "@common/types/rest_api";

export type NewTrailValuesType = ReplaceField<
  ReplaceField<CreateTrailArguments, 'public', boolean>,
  'sailboatId', string
>;
