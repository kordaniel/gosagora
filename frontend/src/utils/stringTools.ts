import type { GeoPos, TimeDuration } from '../types';
import { isNumber, isString } from './typeguards';
import unitConverter, {
  DistanceUnits,
  VelocityUnits,
} from './unitConverter';
import { truncateNumber } from './helpers';

const DST_SUFFIXES: { [K in DistanceUnits]: string } = {
  [DistanceUnits.NauticalMiles]: 'NM',
  [DistanceUnits.Meters]: 'm',
  [DistanceUnits.Kilometers]: 'km',
} as const;

const VEL_SUFFIXES: { [K in VelocityUnits]: string } = {
  [VelocityUnits.Knots]: 'kts',
  [VelocityUnits.MetersPerSec]: 'm/s',
  [VelocityUnits.KilometersPerHour]: 'km/h',
} as const;

export const decimalCoordToDMSString = (
  axis: 'horizontal' | 'vertical',
  decimalDegrees: number | undefined | null
): string => {
  if (decimalDegrees === undefined || decimalDegrees === null) {
    return "--°--'--.--''";
  }
  const suffix = axis === 'horizontal'
    ? decimalDegrees < 0 ? 'W' : 'E'
    : decimalDegrees < 0 ? 'S' : 'N';

  const deg = Math.abs(decimalDegrees);
  const degrees = truncateNumber(deg);
  const fraction = deg - degrees;
  const minutes = truncateNumber(fraction * 60);
  const seconds = (fraction - minutes / 60) * Math.pow(60, 2);

  return `${degrees.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'${seconds.toFixed(2).padStart(3 + 2, '0')}''${suffix}`;
};

export const decimalCoordsToDMSString = (
  coords: Pick<GeoPos, 'lat' | 'lon'> | undefined | null,
  arcSecPrecision: number = 2
) => {
  if (!coords) {
    return { lat: '-', lon: '-', };
  }

  if (coords.lat < -90 || coords.lat > 90) {
    throw new RangeError('latitude value must be between -90 and 90');
  }
  if (coords.lon < -180 || coords.lon > 180) {
    throw new RangeError('longitude values must be between -180 and 180');
  }
  const SN = coords.lat < 0 ? 'S' : 'N';
  const WE = coords.lon < 0 ? 'W' : 'E';

  const lat = Math.abs(coords.lat);
  const latDegrees = truncateNumber(lat);
  const latFraction = lat - latDegrees;
  const latMinutes = truncateNumber(latFraction * 60);
  const latSeconds = (latFraction - latMinutes / 60) * Math.pow(60, 2);

  const lon = Math.abs(coords.lon);
  const lonDegrees = truncateNumber(lon);
  const lonFraction = lon - lonDegrees;
  const lonMinutes = truncateNumber(lonFraction * 60);
  const lonSeconds = (lonFraction - lonMinutes / 60) * Math.pow(60, 2);

  return {
    lat: `${latDegrees.toString().padStart(2, '0')}°${latMinutes.toString().padStart(2, '0')}'${latSeconds.toFixed(arcSecPrecision).padStart(3 + arcSecPrecision, '0')}''${SN}`,
    lon: `${lonDegrees.toString().padStart(2, '0')}°${lonMinutes.toString().padStart(2, '0')}'${lonSeconds.toFixed(arcSecPrecision).padStart(3 + arcSecPrecision, '0')}''${WE}`,
  };
};

export const dateOrTimestampToString = (
  dateOrTimestamp: Date | string | number | undefined | null,
  includeFields: { date?: boolean; time?: boolean; } | undefined = { date: true, time: true }
): string => {
  if (dateOrTimestamp === undefined ||
      dateOrTimestamp === null ||
      (includeFields.date === false && includeFields.time === false)
  ) {
    return '-';
  }
  const dateObj = isString(dateOrTimestamp) || isNumber(dateOrTimestamp)
    ? new Date(dateOrTimestamp)
    : dateOrTimestamp;
  return includeFields.date === false
    ? dateObj.toLocaleTimeString()
    : includeFields.time === false
      ? dateObj.toLocaleDateString()
      : dateObj.toLocaleString();
};

export const distanceToString = (
  meters: number | undefined | null,
  outUnits: DistanceUnits = DistanceUnits.NauticalMiles,
  decimals: number = 1,
): string => {
  if (meters === undefined || meters === null) {
    return `- ${DST_SUFFIXES[outUnits]}`;
  }
  return [
    unitConverter.metersTo(meters, outUnits).toFixed(decimals),
    DST_SUFFIXES[outUnits]
  ].join(' ');
};

export const geoPosAccuracyQualityToString = (
  signalQuality: number,
  accuracy?: number | null,
  accuracyUnits: DistanceUnits = DistanceUnits.Meters,
): string => {
  // NOTE: The actual distances in meters depends on the values assigned to
  //       MAX_ACC_TRESHOLD, MIN_ACC_TRESHOLD in modules/location/helpers.ts
  //       and are larger in development environment.
  const geoPosAccuracy = signalQuality > 90
    ? 'Excellent'   // < ~3.9m
    : signalQuality > 80
      ? 'Good'      // < 4.8m
      : signalQuality > 70
        ? 'Fair'    // < 5.7m
        : signalQuality > 20
          ? 'Poor'  // < ~10.2m
          : 'Lost'; // ~10.2-12m

  return accuracy === undefined || accuracy === null
    ? geoPosAccuracy
    : `${geoPosAccuracy} (${distanceToString(accuracy, accuracyUnits)})`;
};

export const headingToString = (
  heading: number | undefined | null,
  decimals: number = 1
): string => {
  if (heading === undefined || heading === null) {
    return '-°';
  }
  return `${heading.toFixed(decimals)}°`;
};

export const percentageToString = (
  percentage: number | undefined | null,
  decimals: number = 0
): string => {
  if (percentage === undefined || percentage === null) {
    return '-%';
  }
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Converts a TimeDuration object into a printable string. This function expects that every
 * field in the time duration object has a integer value >= 0.
 * @param alwaysIncludeHours Always include hours in the returned string. Defaults to false.
 * @returns Time duration string formatted as: \<HH:\>mm:ss\<.SSS\>.
 */
export const timeDurationToString = (
  duration: TimeDuration,
  alwaysIncludeHours: boolean = false
): string => {
  const formattedDuration = duration.minutes !== 0 || duration.hours !== 0
    ? `${duration.minutes.toString().padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`
    : `00:${duration.seconds.toString().padStart(2, '0')}.${duration.msecs.toString().padStart(3, '0')}`;

  return alwaysIncludeHours || duration.hours !== 0
    ? `${duration.hours.toString().padStart(2, '0')}:${formattedDuration}`
    : formattedDuration;
};

export const velocityToString = (
  metersPerSec: number | undefined | null,
  outUnits: VelocityUnits = VelocityUnits.Knots,
  decimals: number = 1
): string => {
  if (metersPerSec === undefined || metersPerSec === null) {
    return `- ${VEL_SUFFIXES[outUnits]}`;
  }
  return [
    unitConverter.mPerSecTo(metersPerSec, outUnits).toFixed(decimals),
    VEL_SUFFIXES[outUnits]
  ].join(' ');
};
