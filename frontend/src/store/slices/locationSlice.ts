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
  currentPosition: GeoPos | null;
  error: string | null;
  locationWindow: LocationWindow;
  signalQuality: number;
  trackingStatus: TrackingStatus;
}

const initialState: LocationState = {
  currentPosition: null,
  error: null,
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
    addLocation: (state, action: PayloadAction<{ currentPosition: GeoPos | null; signalQuality: number; }>) => {
      state.currentPosition = action.payload.currentPosition;
      state.signalQuality = action.payload.signalQuality;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLocationWindow: (state, action: PayloadAction<Omit<LocationWindow, 'length'>>) => {
      state.locationWindow = {
        length: state.locationWindow.length,
        ...action.payload,
      };
    },
    setTrackingAndErrorStatus: (state, action: PayloadAction<{ trackingStatus: TrackingStatus; error?: string | null; }>) => {
      state.trackingStatus = action.payload.trackingStatus;
      if (action.payload.error !== undefined) {
        state.error = action.payload.error;
      }
    }
  },
});

export const {
  setError: setLocationError,
  setTrackingAndErrorStatus: setLocationTrackingAndErrorStatus,
} = locationSlice.actions;
const {
  addLocation,
  setLocationWindow
} = locationSlice.actions;

export const SelectLocation = (state: RootState): Omit<LocationState, 'locationWindow'> => ({
  currentPosition: state.location.currentPosition,
  error: state.location.error,
  signalQuality: state.location.signalQuality,
  trackingStatus: state.location.trackingStatus,
});

export const handleNewLocation = (geoPosition: GeoPos | null): AppThunk => {
  return (dispatch, getState) => {
    if (geoPosition === null) {
      dispatch(addLocation({ currentPosition: null, signalQuality: 0 }));
      return;
    }

    const locationWindow = getState().location.locationWindow;
    const windowLength = locationWindow.length;
    const window = locationWindow.buffer.slice();
    const index = locationWindow.idxNext;
    const initializingLocWindow = window.length < windowLength;

    window[index] = geoPosition;

    if (index + 1 === windowLength) {
      const currentPosition = computeAveragedGeoPos(window);
      const signalQuality = computeGeoPosAccuracyQuality(currentPosition.acc);
      dispatch(setLocationWindow({
        buffer: window.slice(LOCATION_WINDOW_LEN - LOCATION_WINDOW_OVERLAP),
        idxNext: LOCATION_WINDOW_OVERLAP,
      }));
      dispatch(addLocation({ currentPosition, signalQuality }));
    } else {
      if (initializingLocWindow) {
        const currentPosition = computeAveragedGeoPos(window);
        const signalQuality = computeGeoPosAccuracyQuality(currentPosition.acc);
        dispatch(addLocation({ currentPosition, signalQuality }));
      }
      dispatch(setLocationWindow({
        buffer: window,
        idxNext: index + 1,
      }));
    }
  };
};

export default locationSlice.reducer;
