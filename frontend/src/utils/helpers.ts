export const createReverseEnumMap = <T extends Record<string, string>>(enumObj: T) => {
  return Object.fromEntries(
    Object.entries(enumObj).map(([k, v]) => [v, k])
  ) as { [K in T[keyof T]]: keyof T };
};

export const clampString = (str: string, len: number): string => {
  if (str.length <= len) {
    return str;
  }

  return `${str.substring(0, len-3)}...`;
};

/**
 * Pause execution for ms amount of time before continuing. This function is
 * primarily intended to be used during development, for mimicing latency.
 * @param ms Milliseconds to sleep, defaults to 1 second.
 */
export const sleep = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
