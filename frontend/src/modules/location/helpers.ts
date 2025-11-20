import type { LocationObject } from 'expo-location';

import type { GeoPos, NonNullableFieldsUnion } from '../../types';
import { clampNumber } from '../../utils/helpers';
import config from '../../utils/config';
import { generateIdFromTimestamp } from '../../utils/idGenerator';
import unitConverter from '../../utils/unitConverter';

const LOCATION_WINDOW_LEN = 3;
const LOCATION_WINDOW_OVERLAP = 2; // must be integer in [0, LOCATION_WINDOW_LEN-1]

const MAX_ACC_TRESHOLD = config.IS_DEVELOPMENT_ENV ?   0.0 : 3.0;  // meters, "signal quality" = 100%
const MIN_ACC_TRESHOLD = config.IS_DEVELOPMENT_ENV ? 100.0 : 12.0; // meters, "signal quality" = 0%. Positions with lower accuracy are discarded


export class LocationWindowBuffer {
  private _averagedPosition: GeoPos | null;
  private _buffer: GeoPos[];
  private _bufferMaxLength: number;
  private _idx: number;
  private _isInitializing: boolean;
  private _overlap: number;

  constructor(
    windowLength: number = LOCATION_WINDOW_LEN,
    windowOverlap: number = LOCATION_WINDOW_OVERLAP
  ) {
    if (windowLength < 1) {
      throw new RangeError('LocationWindowBuffer: windowLength must be >= 1');
    }
    if (windowOverlap < 0 || windowOverlap >= windowLength) {
      throw new RangeError(`LocationWindowBuffer: windowOverlap must be an integer in [0,windowLength(default = ${LOCATION_WINDOW_LEN})[`);
    }

    this._averagedPosition = null;
    this._buffer = [];
    this._bufferMaxLength = windowLength;
    this._idx = -1;
    this._isInitializing = true;
    this._overlap = windowOverlap;
  }

  addPosition = (position: GeoPos): GeoPos | null => {
    const pos = { ...position };
    this._idx++;
    if (this._idx === this._bufferMaxLength) {
      this._buffer = this._buffer.slice(this._bufferMaxLength - this._overlap);
      this._idx = this._overlap;
      if (this._isInitializing) {
        this._isInitializing = false;
      }
    }

    this._buffer[this._idx] = pos;

    if (this._isInitializing || this._idx+1 === this._bufferMaxLength) {
      this._computeAveragedPosition();
      return this.getAveragedCurrentPosition();
    }

    return null;
  };

  getAveragedCurrentPosition = (): GeoPos | null => {
    return this._averagedPosition ? { ...this._averagedPosition } : null;
  };

  private _bufferIsEmpty() {
    return this._buffer.length === 0;
  }

  private _computeAveragedPosition() {
    this._averagedPosition = this._bufferIsEmpty()
      ? null
      : computeAveragedGeoPos(this._buffer);
  }
}

/**
 * Compute a new GeoPos object by averaging all fields across every GeoPos instance
 * in the buffer array. If any of the nullable fields in one or more of the input
 * GeoPos instances are null then the corresponding field in the output object will
 * be set to null.
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
