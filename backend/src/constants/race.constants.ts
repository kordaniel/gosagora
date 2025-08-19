import type { ConstantsModelObj } from '../types';

export const RACE_CONSTANTS: ConstantsModelObj = {
  MODEL_NAME: 'race',
  SQL_TABLE_NAME: 'races',
  VALIDATION: {
    DESCRIPTION_LEN: {
      MIN: 4,
      MAX: 2000,
    },
    EMAIL_LEN: {
      MIN: 8,
      MAX: 256,
    },
    NAME_LEN: {
      MIN: 4,
      MAX: 128,
    },
    URL_LEN: {
      MIN: 8,
      MAX: 256,
    },
  }
} as const;
