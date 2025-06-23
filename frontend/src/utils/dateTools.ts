import { isString } from './typeguards';

const MSEC_IN_DAY = 1000 * 24 * 60 * 60;

export const formatDate = (date: Date | string): string => {
  const dateObj = isString(date) ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

export const getDateOffsetDaysFromNow = (daysOffset: number = 0): Date => {
  return new Date(Date.now() + (daysOffset * MSEC_IN_DAY));
};

export const getYearLastDateYearsFromNow = (yearsOffset: number = 0): Date => {
  return new Date(new Date().getFullYear() + yearsOffset, 11, 31, 23, 59, 999);
};
