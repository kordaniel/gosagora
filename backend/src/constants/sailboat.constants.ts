export const SAILBOAT_CONSTANTS = {
  MODEL_NAME: 'sailboat',
  SQL_TABLE_NAME: 'sailboats',
  VALIDATION: {
    DESCRIPTION_LEN: {
      MIN: 4,
      MAX: 256,
    },
    NAME_LEN: {
      MIN: 2,
      MAX: 64,
    },
    SAIL_NUMBER_LEN: {
      MIN: 1,
      MAX: 16,
    },
  },
} as const;
