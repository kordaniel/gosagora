import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppThunk, RootState } from '../index';
import {
  computeAveragedGeoPos,
  computeGeoPosAccuracyQuality
} from '../../modules/location/helpers';
import type { GeoPos } from '../../types';

const HISTORY_MAX_AGE_MIN = 10; // TODO: Cut history by MAX(minutes, array length)
const HISTORY_MAX_LEN = HISTORY_MAX_AGE_MIN * 60;
const LOCATION_WINDOW_LEN = 3;
const LOCATION_WINDOW_OVERLAP = 2; // must be integer in [0, LOCATION_WINDOW_LEN-1]

if (LOCATION_WINDOW_OVERLAP < 0 || LOCATION_WINDOW_OVERLAP >= LOCATION_WINDOW_LEN) {
  throw new Error('GeoPosition smoothing window size and/or overlap misconfiguration');
}

type TrackingStatus = 'idle' | 'background' | 'foreground' | 'foreground-simulated';

interface LocationWindow {
  buffer: GeoPos[];
  idxNext: number;
  length: number;
}

export interface LocationState {
  current: GeoPos | null;
  error: string | null;
  history: Array<GeoPos | null>;
  historyMaxLen: number;
  locationWindow: LocationWindow;
  signalQuality: number;
  trackingStatus: TrackingStatus;
}

const initialState: LocationState = {
  current: null,
  error: null,
  history: [],
  historyMaxLen: HISTORY_MAX_LEN,
  locationWindow: {
    buffer: [],
    idxNext: 0,
    length: LOCATION_WINDOW_LEN,
  },
  signalQuality: 0,
  trackingStatus: 'idle',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<{ current: GeoPos | null; signalQuality: number; }>) => {
      if (state.current !== null || (state.history.length > 0 && state.history.at(-1) !== null)) {
        state.history = state.history
          .slice(-(state.historyMaxLen-1))
          .concat(state.current);
      }
      state.current = action.payload.current;
      state.signalQuality = action.payload.signalQuality;
    },
    setHistoryMaxLen: (state, action: PayloadAction<number>) => {
      state.historyMaxLen = action.payload;
      if (state.history.length > action.payload) {
        state.history = state.history.slice(-action.payload);
      }
    },
    setLocationWindow: (state, action: PayloadAction<Omit<LocationWindow, 'length'>>) => {
      state.locationWindow = {
        length: state.locationWindow.length,
        ...action.payload,
      };
    },
    setTrackingAndErrorStatus: (state, action: PayloadAction<{ trackingStatus: TrackingStatus; error: string | null; }>) => {
      state.trackingStatus = action.payload.trackingStatus;
      state.error = action.payload.error;
    }
  },
});

export const {
  setHistoryMaxLen: setLocationHistoryMaxLen,
  setTrackingAndErrorStatus: setLocationTrackingAndErrorStatus,
} = locationSlice.actions;
const {
  addLocation,
  setLocationWindow
} = locationSlice.actions;

export const SelectLocation = (state: RootState): Omit<LocationState, 'locationWindow'> => ({
  current: state.location.current,
  error: state.location.error,
  history: state.location.history,
  historyMaxLen: state.location.historyMaxLen,
  signalQuality: state.location.signalQuality,
  trackingStatus: state.location.trackingStatus,
});

export const handleNewLocation = (geoPosition: GeoPos | null): AppThunk => {
  return (dispatch, getState) => {
    if (geoPosition === null) {
      dispatch(addLocation({ current: null, signalQuality: 0 }));
      return;
    }

    const locationWindow = getState().location.locationWindow;
    const windowLength = locationWindow.length;
    const window = locationWindow.buffer.slice();
    const index = locationWindow.idxNext;
    const initializingLocWindow = window.length < windowLength;

    window[index] = geoPosition;

    if (index + 1 === windowLength) {
      const current = computeAveragedGeoPos(window);
      const signalQuality = computeGeoPosAccuracyQuality(current.acc);
      dispatch(setLocationWindow({
        buffer: window.slice(LOCATION_WINDOW_LEN - LOCATION_WINDOW_OVERLAP),
        idxNext: LOCATION_WINDOW_OVERLAP,
      }));
      dispatch(addLocation({ current, signalQuality }));
    } else {
      if (initializingLocWindow) {
        const current = computeAveragedGeoPos(window);
        const signalQuality = computeGeoPosAccuracyQuality(current.acc);
        dispatch(addLocation({ current, signalQuality }));
      }
      dispatch(setLocationWindow({
        buffer: window,
        idxNext: index + 1,
      }));
    }
  };
};

export default locationSlice.reducer;
