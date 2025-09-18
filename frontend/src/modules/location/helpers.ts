import type { LocationObject } from 'expo-location';

import type { GeoPos, NonNullableFieldsUnion } from '../../types';
import { clampNumber } from '../../utils/helpers';
import config from '../../utils/config';
import { generateIdFromTimestamp } from '../../utils/idGenerator';
import unitConverter from '../../utils/unitConverter';

const MAX_ACC_TRESHOLD = config.IS_DEVELOPMENT_ENV ?   0.0 : 3.0;  // meters, "signal quality" = 100%
const MIN_ACC_TRESHOLD = config.IS_DEVELOPMENT_ENV ? 100.0 : 12.0; // meters, "signal quality" = 0%. Positions with lower accuracy are discarded

/**
 * Compute a new GeoPos object by averaging all fields across every GeoPos instance
 * in the buffer array. If any of the nullable fields in one or more of the input
 * GeoPos instances are null then the corresponding field in the output object will
 * be set to null.
 * the input instances
 * @param buffer Input buffer containing GeoPos object instances.
 * @returns Averaged GeoPos object.
 */
export const computeAveragedGeoPos = (buffer: GeoPos[]): GeoPos => {
  const sum = buffer.reduce<
    Omit<GeoPos, 'id' | 'hdg'> & { hdgVec: [number, number] | null; }
  >((accumulator, cur) => {
    accumulator.timestamp += cur.timestamp;
    accumulator.lat += cur.lat;
    accumulator.lon += cur.lon;
    accumulator.acc += cur.acc;
    if (accumulator.vel !== null && cur.vel !== null) {
      accumulator.vel += cur.vel;
    } else {
      accumulator.vel = null;
    }
    if (accumulator.hdgVec !== null && cur.hdg !== null && !isNaN(cur.hdg)) {
      accumulator.hdgVec[0] += Math.sin(unitConverter.degToRad(cur.hdg));
      accumulator.hdgVec[1] += Math.cos(unitConverter.degToRad(cur.hdg));
    } else {
      accumulator.hdgVec = null;
    }
    return accumulator;
  }, {
    timestamp: 0, lat: 0, lon: 0, acc: 0, vel: 0, hdgVec: [0, 0]
  });

  const finalTimestamp = Math.round(sum.timestamp / buffer.length);

  return {
    id: generateIdFromTimestamp(finalTimestamp),
    timestamp: finalTimestamp,
    lat: sum.lat / buffer.length,
    lon: sum.lon / buffer.length,
    acc: sum.acc / buffer.length,
    vel: sum.vel !== null ? sum.vel / buffer.length : null,
    hdg: sum.hdgVec === null
      ? null
      : (unitConverter.radToDeg(Math.atan2(sum.hdgVec[0], sum.hdgVec[1])) + 360) % 360,
  };
};

/**
 * Linerly maps GeoPos accuracy from meters to percentages, where the highest accuracy 100 is
 * obtained when the accuracy in meters is <= MAX_ACC_TRESHOLD and the worst accuracy when accuracy
 * in meters is >= MIN_ACC_TRESHOLD.
 * @param acc Accuracy in meters.
 * @returns "Signal quality" in [0,100] range.
 */
export const computeGeoPosAccuracyQuality = (acc: GeoPos['acc']): number => {
  return 100 * (
    clampNumber(acc, MAX_ACC_TRESHOLD, MIN_ACC_TRESHOLD) - MIN_ACC_TRESHOLD
  ) / (MAX_ACC_TRESHOLD - MIN_ACC_TRESHOLD);
};

const locObjIsValidGeoPos = (pos: LocationObject): pos is Omit<LocationObject, 'coords'> & {
  coords: NonNullableFieldsUnion<LocationObject['coords'], 'accuracy'>;
} => {
  return pos.coords.accuracy !== null && pos.coords.accuracy < MIN_ACC_TRESHOLD;
};

export const locObjToGeoPos = (pos: LocationObject | null): GeoPos | null => {
  return pos === null || !locObjIsValidGeoPos(pos)
    ? null
    : {
        id: generateIdFromTimestamp(pos.timestamp),
        timestamp: pos.timestamp,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        acc: pos.coords.accuracy,
        hdg: pos.coords.heading,
        vel: pos.coords.speed,
      };
};
