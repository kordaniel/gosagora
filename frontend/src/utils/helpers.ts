export const createReverseEnumMap = <T extends Record<string, string>>(enumObj: T) => {
  return Object.fromEntries(
    Object.entries(enumObj).map(([k, v]) => [v, k])
  ) as { [K in T[keyof T]]: keyof T };
};

export const clampNumber = (value: number, min: number, max: number): number => {
  if (min > max) {
    throw new RangeError('clampNumber: argument min cannot be greater than argument max');
  }
  return Math.min(Math.max(value, min), max);
};

export const clampString = (str: string, len: number): string => {
  if (str.length <= len) {
    return str;
  }

  return `${str.substring(0, len-3)}...`;
};

export const randRange = (minInclusive: number, maxExclusive: number): number => {
  return minInclusive + Math.random() * (maxExclusive-minInclusive);
};

export const randUnitRangeFrom = (minInclusive: number): number => {
  return minInclusive + Math.random();
};

export const roundNumber = (value: number, decimals: number = 0): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

export const truncateNumber = (value: number): number => {
  return value > 0 ? Math.floor(value) : Math.ceil(value);
};

/**
 * Pause execution for ms amount of time before continuing. This function is
 * primarily intended to be used during development, for mimicing latency.
 * @param ms Milliseconds to sleep, defaults to 1 second.
 */
export const sleep = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
