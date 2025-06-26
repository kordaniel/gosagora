export const generateRandomString = (
  length: number,
  srcChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  return Array.from({ length }).map(
    () => srcChars.charAt(Math.floor(Math.random() * srcChars.length))
  ).join('');
};

export const shuffleString = (str: string): string => {
  return str.split('').sort(() => Math.random() - 0.5).join('');
};

const MSEC_IN_SEC = 1000;
const MSEC_IN_MIN = 60 * MSEC_IN_SEC;
const MSEC_IN_HOUR = 60 * MSEC_IN_MIN;
const MSEC_IN_DAY = 24 * MSEC_IN_HOUR;

export const getTimeSpanInMsec = (
  days: number = 0,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): number => {
  return days * MSEC_IN_DAY
    + hours * MSEC_IN_HOUR
    + minutes * MSEC_IN_MIN
    + seconds * MSEC_IN_SEC;
};
