export const MSEC_IN_DAY = 1000 * 24 * 60 * 60;

export const getDateOffsetDaysFromNow = (daysOffset: number = 0): Date => {
  return new Date(Date.now() + (daysOffset * MSEC_IN_DAY));
};

export const getDateUTCDateOnlyOffsetDaysFromNow = (daysOffset: number = 0): Date => {
  const now = getDateOffsetDaysFromNow(daysOffset);
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const getUTCYearLastDateOffsetYearsFromNow  = (yearsOffset: number = 0): Date => {
  const now = getDateOffsetDaysFromNow(0);
  return new Date(Date.UTC(now.getUTCFullYear() + yearsOffset, 11, 31, 23, 59, 59, 999));
};

/**
 * Checks if a string is a javascript UTC date time string format.
 * Returns false for strings hodling expanded years.
 *
 * NOTE: This check prioritizes speed over accuracy; it's not
 *       exhaustive and should not be used with untrusted inputs.
 * @param datetime Javascript Date toISOString
 * @returns boolean
 */
export const isJSISOUTCDateStr = (datetime: string): boolean => {
  if (datetime.length !== 24) {
    return false;
  }

  if (datetime[10] !== 'T' || !datetime.endsWith('Z')) {
    return false;
  }

  return true;
};
