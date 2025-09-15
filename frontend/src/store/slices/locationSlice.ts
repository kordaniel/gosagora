import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { GeoPos } from '../../types';
import type { RootState } from '../index';

const HISTORY_MAX_AGE_MIN = 10; // TODO: Cut history by MAX(minutes, array length)
const HISTORY_MAX_LEN = HISTORY_MAX_AGE_MIN * 60;

type LocationStatus = 'idle' | 'background' | 'foreground';

export interface LocationSlice {
  current: GeoPos | null;
  history: Array<GeoPos | null>;
  historyMaxLen: number;
  status: LocationStatus
}

const initialState: LocationSlice = {
  current: null,
  history: [],
  historyMaxLen: HISTORY_MAX_LEN,
  status: 'idle',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<GeoPos | null>) => {
      // TODO: Add addLocations that takes array, refactor modules/location handBgLocations to use the new reducer
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
    setStatus: (state, action: PayloadAction<LocationStatus>) => {
      state.status = action.payload;
    }
  },
});

export const {
  addLocation,
  setHistoryMaxLen: setLocationHistoryMaxLen,
  setStatus: setLocationStatus,
} = locationSlice.actions;

export const SelectLocation = (state: RootState) => state.location;

export default locationSlice.reducer;
