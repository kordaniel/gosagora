/**
 * Pause execution for ms amount of time before continuing. This function is
 * primarily intended to be used during development, for mimicing latency.
 * @param ms Milliseconds to sleep, defaults to 1 second.
 */
export const sleep = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
