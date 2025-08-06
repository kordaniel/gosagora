export const isEmptyObject = (param: unknown): param is Record<never, never> => {
  if (param === null || param === undefined) {
    return false;
  }
  return typeof param === 'object' && !Array.isArray(param) && Object.keys(param).length === 0;
};

export const isNumber = (param: unknown): param is number => {
  return typeof param === 'number';
};

export const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
