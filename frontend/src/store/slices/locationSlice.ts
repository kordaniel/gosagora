import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { GeoPos } from '../../types';
import type { RootState } from '../index';

const HISTORY_MAX_LEN = 20;

export interface LocationSlice {
  current: GeoPos | null;
  history: Array<GeoPos | null>;
}

const initialState: LocationSlice = {
  current: null,
  history: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<GeoPos | null>) => {
      if (state.current !== null || (state.history.length > 0 && state.history.at(-1) !== null)) {
        state.history = state.history
          .concat(state.current)
          .slice(-HISTORY_MAX_LEN);
      }
      state.current = action.payload;
    },
  },
});

export const { addLocation } = locationSlice.actions;

export const SelectLocation = (state: RootState) => state.location;

export default locationSlice.reducer;
