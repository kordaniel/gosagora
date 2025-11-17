import type { ConstantsModelObj } from '../types';

export const LOGGED_TRAIL_POSITION_CONSTANTS: Omit<ConstantsModelObj, 'VALIDATION'> = {
  MODEL_NAME: 'loggedTrailPosition',
  SQL_TABLE_NAME: 'logged_trail_positions',
} as const;
