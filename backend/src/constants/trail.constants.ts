import type { ConstantsModelObj } from '../types';

export const TRAIL_CONSTANTS: ConstantsModelObj = {
  MODEL_NAME: 'trail',
  SQL_TABLE_NAME: 'trails',
  VALIDATION: {
    DESCRIPTION_LEN: {
      MIN: 4,
      MAX: 2000,
    },
    NAME_LEN: {
      MIN: 4,
      MAX: 128,
    },
  },
} as const;
