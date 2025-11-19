import type { GeoPos, NonNullableFields } from '../../../src/types';
import { LocationWindowBuffer } from '../../../src/modules/location/helpers';
import { generateIdFromTimestamp } from '../../../src/utils/idGenerator';

const normalizeGeoPosId = (pos: GeoPos | null): GeoPos | null => pos === null ? null : ({
  ...pos,
  id: pos.id.split('-')[0]
});

const DEFAULT_LOCATION_WINDOW_LEN = 3;
const DEFAULT_LOCATION_WINDOW_OVERLAP = 2;
const LOCATION_WINDOW_LEN = 5;
const LOCATION_WINDOW_OVERLAP = 3;

describe('Modules/location/helpers', () => {

  describe('LocationWindowBuffer', () => {
    const baseDate = new Date();
    let defaultLocationWindowBuffer: LocationWindowBuffer | undefined = undefined;
    let locationWindowBuffer: LocationWindowBuffer | undefined = undefined;
    const initialPosition: GeoPos = {
      id: generateIdFromTimestamp(baseDate.getTime()),
      timestamp: baseDate.getTime(),
      lat: -10.0,
      lon: 10.0,
      acc: 5.0,
      hdg: 10.0,
      vel: 2.0,
    };

    beforeEach(() => {
      defaultLocationWindowBuffer = new LocationWindowBuffer();
      locationWindowBuffer = new LocationWindowBuffer(LOCATION_WINDOW_LEN, LOCATION_WINDOW_OVERLAP);
    });

    it('throws if created with invalid buffer sizes', () => {
      expect(() => new LocationWindowBuffer(0)).toThrow('LocationWindowBuffer: windowLength must be >= 1');
      expect(() => new LocationWindowBuffer(2)).toThrow('LocationWindowBuffer: windowOverlap must be an integer in [0,windowLength(default = 3)[');
      expect(() => new LocationWindowBuffer(1, -1)).toThrow('LocationWindowBuffer: windowOverlap must be an integer in [0,windowLength(default = 3)[');
      expect(() => new LocationWindowBuffer(5, 5)).toThrow('LocationWindowBuffer: windowOverlap must be an integer in [0,windowLength(default = 3)[');
    });

    it('initial getAveragedCurrentPosition is null', () => {
      if (!locationWindowBuffer) {
        throw new Error('Internal test error: locationWindowBuffer not initialized');
      }
      expect(locationWindowBuffer.getAveragedCurrentPosition()).toBe(null);
    });

    it('returns the same initial position', () => {
      if (!locationWindowBuffer || !defaultLocationWindowBuffer) {
        throw new Error('Internal test error: locationWindowBuffers not initialized');
      }
      const expected = normalizeGeoPosId(initialPosition);
      expect(normalizeGeoPosId(defaultLocationWindowBuffer.addPosition(initialPosition)))
        .toStrictEqual(expected);
      expect(normalizeGeoPosId(locationWindowBuffer.addPosition(initialPosition)))
        .toStrictEqual(expected);
    });

    it('returns a new average of all positions in buffer for every inserted position while initializing buffer', () => {
      if (!locationWindowBuffer || !defaultLocationWindowBuffer) {
        throw new Error('Internal test error: locationWindowBuffers not initialized');
      }
      const sumPos = { timestamp: 0.0, lat: 0.0, lon: 0.0, acc: 0.0, hdg: 0.0, vel: 0.0, };

      for (let i = 1; i <= LOCATION_WINDOW_LEN; i++) {
        const timestamp = initialPosition.timestamp + i * 1000;
        const nextPos: NonNullableFields<GeoPos> = {
          id: generateIdFromTimestamp(timestamp),
          timestamp,
          lat: initialPosition.lat +  i * 0.2,
          lon: initialPosition.lon -  i * 0.2,
          acc: initialPosition.acc -  i * 0.2,
          hdg: initialPosition.hdg! + i * 2.0,
          vel: initialPosition.vel! + i * 0.2,
        };
        sumPos.timestamp += nextPos.timestamp;
        sumPos.lat += nextPos.lat;
        sumPos.lon += nextPos.lon;
        sumPos.acc += nextPos.acc;
        sumPos.hdg += nextPos.hdg;
        sumPos.vel += nextPos.vel;

        const { hdg: resultHdg, ...result } = normalizeGeoPosId(locationWindowBuffer.addPosition(nextPos))!;
        const expectedTimestamp = Math.round(sumPos.timestamp / i);
        const { hdg: expectedHdg, ...expected } = normalizeGeoPosId({
          id: generateIdFromTimestamp(expectedTimestamp),
          timestamp: expectedTimestamp,
          lat: sumPos.lat / i,
          lon: sumPos.lon / i,
          acc: sumPos.acc / i,
          hdg: sumPos.hdg / i,
          vel: sumPos.vel / i,
        })!;

        if (i <= DEFAULT_LOCATION_WINDOW_LEN) {
          const { hdg: defaultResultHdg, ...defaultResult } = normalizeGeoPosId(defaultLocationWindowBuffer.addPosition(nextPos))!;
          expect(defaultResult).toStrictEqual(expected);
          expect(defaultResultHdg).toBeCloseTo(expectedHdg!);
        }

        expect(result).toStrictEqual(expected);
        expect(resultHdg).toBeCloseTo(expectedHdg!);
      }
    });

    it('when buffer of default size is initialized returns a new average of positions in buffer when window is filled and null otherwise', () => {
      if (!defaultLocationWindowBuffer) {
        throw new Error('Internal test error: defaultLocationWindowBuffer not initialized');
      }
      const insertedPositions = [];

      let i = 0;
      for (; i < DEFAULT_LOCATION_WINDOW_LEN; i++) {
        const timestamp = initialPosition.timestamp + i * 1000;
        const nextPos: NonNullableFields<GeoPos> = {
          id: generateIdFromTimestamp(timestamp),
          timestamp,
          lat: initialPosition.lat +  i * 0.2,
          lon: initialPosition.lon -  i * 0.2,
          acc: initialPosition.acc -  i * 0.2,
          hdg: initialPosition.hdg! + i * 2.0,
          vel: initialPosition.vel! + i * 0.2,
        };
        insertedPositions.push(nextPos);
        normalizeGeoPosId(defaultLocationWindowBuffer.addPosition(nextPos));
      }
      i--;

      for (let j = 1; j <= 2*DEFAULT_LOCATION_WINDOW_LEN; j++) {
        const timestamp = initialPosition.timestamp + (i+j) * 1000;
        const nextPos: NonNullableFields<GeoPos> = {
          id: generateIdFromTimestamp(timestamp),
          timestamp,
          lat: initialPosition.lat +  (i+j) * 0.2,
          lon: initialPosition.lon -  (i+j) * 0.2,
          acc: initialPosition.acc -  (i+j) * 0.2,
          hdg: initialPosition.hdg! + (i+j) * 2.0,
          vel: initialPosition.vel! + (i+j) * 0.2,
        };
        insertedPositions.push(nextPos);

        const res = defaultLocationWindowBuffer.addPosition(nextPos);

        if (j % (DEFAULT_LOCATION_WINDOW_LEN-DEFAULT_LOCATION_WINDOW_OVERLAP) !== 0) {
          expect(res).toBeNull();
        } else {
          const sliced = insertedPositions.slice(insertedPositions.length-DEFAULT_LOCATION_WINDOW_LEN);
          const timestamp = sliced.reduce((a, c) => a + c.timestamp, 0) / sliced.length;
          const lat = sliced.reduce((a, c) => a + c.lat, 0) / sliced.length;
          const lon = sliced.reduce((a, c) => a + c.lon, 0) / sliced.length;
          const acc = sliced.reduce((a, c) => a + c.acc, 0) / sliced.length;
          const hdg = sliced.reduce((a, c) => a + c.hdg, 0) / sliced.length;
          const vel = sliced.reduce((a, c) => a + c.vel, 0) / sliced.length;
          const expected = normalizeGeoPosId({
            id: generateIdFromTimestamp(timestamp),
            timestamp, lat, lon, acc, hdg, vel
          });
          expect(normalizeGeoPosId(res)).toStrictEqual(expected);
        }
      }
    });

    it('when buffer is initialized returns a new average of positions in buffer when window is filled and null otherwise', () => {
      if (!locationWindowBuffer) {
        throw new Error('Internal test error: locationWindowBuffers not initialized');
      }
      const insertedPositions = [];

      let i = 0;
      for (; i < LOCATION_WINDOW_LEN; i++) {
        const timestamp = initialPosition.timestamp + i * 1000;
        const nextPos: NonNullableFields<GeoPos> = {
          id: generateIdFromTimestamp(timestamp),
          timestamp,
          lat: initialPosition.lat +  i * 0.2,
          lon: initialPosition.lon -  i * 0.2,
          acc: initialPosition.acc -  i * 0.2,
          hdg: initialPosition.hdg! + i * 2.0,
          vel: initialPosition.vel! + i * 0.2,
        };
        insertedPositions.push(nextPos);
        normalizeGeoPosId(locationWindowBuffer.addPosition(nextPos));
      }
      i--;

      for (let j = 1; j <= 2*LOCATION_WINDOW_LEN; j++) {
        const timestamp = initialPosition.timestamp + (i+j) * 1000;
        const nextPos: NonNullableFields<GeoPos> = {
          id: generateIdFromTimestamp(timestamp),
          timestamp,
          lat: initialPosition.lat +  (i+j) * 0.2,
          lon: initialPosition.lon -  (i+j) * 0.2,
          acc: initialPosition.acc -  (i+j) * 0.2,
          hdg: initialPosition.hdg! + (i+j) * 2.0,
          vel: initialPosition.vel! + (i+j) * 0.2,
        };
        insertedPositions.push(nextPos);

        const res = locationWindowBuffer.addPosition(nextPos);

        if (j % (LOCATION_WINDOW_LEN-LOCATION_WINDOW_OVERLAP) !== 0) {
          expect(res).toBeNull();
        } else {
          const sliced = insertedPositions.slice(insertedPositions.length-LOCATION_WINDOW_LEN);
          const timestamp = sliced.reduce((a, c) => a + c.timestamp, 0) / sliced.length;
          const lat = sliced.reduce((a, c) => a + c.lat, 0) / sliced.length;
          const lon = sliced.reduce((a, c) => a + c.lon, 0) / sliced.length;
          const acc = sliced.reduce((a, c) => a + c.acc, 0) / sliced.length;
          const hdg = sliced.reduce((a, c) => a + c.hdg, 0) / sliced.length;
          const vel = sliced.reduce((a, c) => a + c.vel, 0) / sliced.length;
          const expected = normalizeGeoPosId({
            id: generateIdFromTimestamp(timestamp),
            timestamp, lat, lon, acc, hdg, vel
          });
          expect(normalizeGeoPosId(res)).toStrictEqual(expected);
        }
      }
    });

  }); // LocationWindowBuffer

}); // Modules/location/helpers
