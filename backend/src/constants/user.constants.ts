import type { ConstantsModelObj } from '../types';

export const USER_CONSTANTS: ConstantsModelObj = {
  MODEL_NAME: 'user',
  SQL_TABLE_NAME: 'users',
  VALIDATION: {
    DISPLAY_NAME_LEN: {
      MIN: 4,
      MAX: 64,
    },
    EMAIL_LEN: {
      MIN: 8,
      MAX: 256,
    },
    PASSWORD_LEN: {
      MIN: 8,
      MAX: 30,
    },
  }
} as const;
