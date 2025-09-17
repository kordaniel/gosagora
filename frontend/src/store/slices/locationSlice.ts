import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppThunk, RootState } from '../index';
import type { GeoPos } from '../../types';
import { generateIdFromTimestamp } from '../../utils/idGenerator';
import unitConverter from '../../utils/unitConverter';

const HISTORY_MAX_AGE_MIN = 10; // TODO: Cut history by MAX(minutes, array length)
const HISTORY_MAX_LEN = HISTORY_MAX_AGE_MIN * 60;
const LOCATION_WINDOW_LEN = 3;
const LOCATION_WINDOW_OVERLAP = 2;

type LocationStatus = 'idle' | 'background' | 'foreground';

interface LocationWindow {
  buffer: GeoPos[];
  idxNext: number;
  length: number;
}

export interface LocationSlice {
  current: GeoPos | null;
  history: Array<GeoPos | null>;
  historyMaxLen: number;
  locationWindow: LocationWindow;
  status: LocationStatus
}

const initialState: LocationSlice = {
  current: null,
  history: [],
  historyMaxLen: HISTORY_MAX_LEN,
  locationWindow: {
    buffer: [],
    idxNext: 0,
    length: LOCATION_WINDOW_LEN,
  },
  status: 'idle',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<GeoPos | null>) => {
      if (state.current !== null || (state.history.length > 0 && state.history.at(-1) !== null)) {
        state.history = state.history
          .slice(-(state.historyMaxLen-1))
          .concat(state.current);
      }
      state.current = action.payload;
    },
    setHistoryMaxLen: (state, action: PayloadAction<number>) => {
      state.historyMaxLen = action.payload;
      if (state.history.length > action.payload) {
        state.history = state.history.slice(-action.payload);
      }
    },
    setLocationWindow: (state, action: PayloadAction<LocationWindow>) => {
      state.locationWindow = action.payload;
    },
    setStatus: (state, action: PayloadAction<LocationStatus>) => {
      state.status = action.payload;
    }
  },
});

export const {
  setHistoryMaxLen: setLocationHistoryMaxLen,
  setStatus: setLocationStatus,
} = locationSlice.actions;
const {
  addLocation,
  setLocationWindow
} = locationSlice.actions;

export const SelectLocation = (state: RootState) => state.location;

const computeAveragedPosition = (buffer: GeoPos[]): GeoPos => {
  if (buffer.length !== LOCATION_WINDOW_LEN) {
    throw new Error('invalid buffer len');
  }

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

export const handleNewLocation = (pos: GeoPos | null): AppThunk => {
  return (dispatch, getState) => {
    if (pos === null) {
      return; // TODO: Handle !!!
    }

    const locationWindow = getState().location.locationWindow;
    const windowLength = locationWindow.length;
    const window = locationWindow.buffer.slice();
    const index = locationWindow.idxNext;

    window[index] = pos;

    if (index + 1 === windowLength) {
      const newPos = computeAveragedPosition(window);
      dispatch(setLocationWindow({
        // TODO: No need to slice(?)
        buffer: window.slice(LOCATION_WINDOW_LEN - LOCATION_WINDOW_OVERLAP),
        idxNext: LOCATION_WINDOW_OVERLAP,
        length: windowLength, // TODO: Never changes, fix!
      }));
      dispatch(addLocation(newPos));
    } else {
      dispatch(setLocationWindow({
        buffer: window,
        idxNext: index + 1,
        length: windowLength,
      }));
    }
  };
};

export default locationSlice.reducer;
