import type { DateRange } from '../types';

export const isDateRange = (param: unknown): param is DateRange => {
  if (!param || typeof param !== 'object') {
    return false;
  }
  if (!(('startDate' in param) && (param.startDate instanceof Date))) {
    return false;
  }
  if (!(('endDate' in param) && (param.endDate instanceof Date))) {
    return false;
  }

  return true;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};
