let idCounter: number = 0;

export const generateNumericId = (): number => {
  return ++idCounter;
};

/**
 * Generates an id that consists of the timestamp and a unique number,
 * both encoded in base36 and separated by a dash.
 * @param timestamp To use as the suffix for the id.
 * @returns Generated id.
 */
export const generateIdFromTimestamp = (timestamp: number): string => {
  idCounter++;
  return `${timestamp.toString(36)}-${idCounter.toString(36)}`;
};
