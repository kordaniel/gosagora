export const isNumber = (param: unknown): param is number => {
  return typeof param === 'number';
};

export const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
