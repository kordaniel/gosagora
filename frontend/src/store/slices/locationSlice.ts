import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppThunk, RootState } from '../index';
import type { GeoPos } from '../../types';
import {
  computeGeoPosAccuracyQuality,
} from '../../modules/location/helpers';

type TrackingStatus = 'idle' | 'background' | 'foreground' | 'foreground-simulated';

export interface LocationState {
  currentPosition: GeoPos | null;
  error: string | null;
  signalQuality: number;
  trackingStatus: TrackingStatus;
}

const initialState: LocationState = {
  currentPosition: null,
  error: null,
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
} = locationSlice.actions;

export const SelectLocation = (state: RootState): LocationState => ({
  currentPosition: state.location.currentPosition,
  error: state.location.error,
  signalQuality: state.location.signalQuality,
  trackingStatus: state.location.trackingStatus,
});

export const handleNewLocation = (currentPosition: GeoPos | null): AppThunk => {
  return (dispatch, getState) => {
    if (currentPosition === null && getState().location.currentPosition === null) {
      return;
    }
    dispatch(addLocation({
      currentPosition,
      signalQuality: currentPosition ? computeGeoPosAccuracyQuality(currentPosition.acc) : 0,
    }));
  };
};

export default locationSlice.reducer;
