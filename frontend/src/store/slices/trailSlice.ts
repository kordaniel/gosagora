import {
  type PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import {
  type NewTrailValuesType,
  toTrailListing,
} from '../../models/trail';
import { type ReplaceField } from '../../types';
import trailService from '../../services/trailService';
import { trailValuesToTrailArguments } from '../../schemas/trail';

import {
  type TrailListing
} from '@common/types/trail';
import {
  type TrailListingData,
} from '@common/types/rest_api';

interface TrailSliceTrails {
  trails: TrailListingData[];
  loading: boolean;
  error: string | null;
}

interface TrailSliceSubmitNewTrail {
  error: string | null;
  loading: boolean;
}

interface TrailState {
  trails: TrailSliceTrails;
  submitNewTrail: TrailSliceSubmitNewTrail;
}

const initialState: TrailState = {
  trails: {
    error: null,
    loading: false,
    trails: [],
  },
  submitNewTrail: {
    error: null,
    loading: false,
  },
};

export const trailSlice = createSlice({
  name: 'trail',
  initialState,
  reducers: {
    appendNewSubmittedTrail: (state, action: PayloadAction<TrailListingData>) => {
      state.trails.trails = [...state.trails.trails, action.payload];
      state.submitNewTrail = {
        error: null,
        loading: false,
      };
    },
    setSubmitNewTrailError: (state, action: PayloadAction<string | null>) => {
      state.submitNewTrail.error = action.payload;
    },
    setSubmitNewTrailLoading: (state, action: PayloadAction<boolean>) => {
      state.submitNewTrail.loading = action.payload;
    },
    setTrailsError: (state, action: PayloadAction<string | null>) => {
      state.trails.error = action.payload;
    },
    setTrailsLoading: (state, action: PayloadAction<boolean>) => {
      state.trails.loading = action.payload;
    },
    setTrailsTrailsAfterSuccessfullGet: (state, action: PayloadAction<TrailListingData[]>) => {
      state.trails.trails = action.payload;
      state.trails.error = null;
    },
  }
});

const {
  appendNewSubmittedTrail,
  setSubmitNewTrailError,
  setSubmitNewTrailLoading,
  setTrailsError,
  setTrailsLoading,
  setTrailsTrailsAfterSuccessfullGet,
} = trailSlice.actions;

export const SelectSubmitNewTrail = (state: RootState): TrailSliceSubmitNewTrail => state.trail.submitNewTrail;

export const SelectTrails = createSelector(
  (state: RootState) => state.trail.trails,
  (trails: TrailSliceTrails): ReplaceField<TrailSliceTrails, 'trails', TrailListing[]> => ({
    ...trails,
    trails: trails.trails.map(toTrailListing),
  }),
);

export const initializeTrails = (): AppAsyncThunk => {
  return async (dispatch) => {
    dispatch(setTrailsLoading(true));

    try {
      const trails = await trailService.getAll();
      dispatch(setTrailsTrailsAfterSuccessfullGet(trails));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setTrailsError(error.message));
      } else {
        dispatch(setTrailsError('Unknown error happened while loading trails'));
        console.error('unhandled get trails error:', error);
      }
    }

    dispatch(setTrailsLoading(false));
  };
};

export const submitNewTrail = (values: NewTrailValuesType): AppAsyncThunk<number | null> => {
  return async (dispatch) => {
    dispatch(setSubmitNewTrailLoading(true));
    try {
      const newTrail = await trailService.create(trailValuesToTrailArguments(values));
      dispatch(appendNewSubmittedTrail(newTrail));

      return newTrail.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setSubmitNewTrailError(error.message));
      } else {
        dispatch(setSubmitNewTrailError('Unknown error happened while creating trail'));
        console.error('unhandled post new trail error:', error);
      }
      dispatch(setSubmitNewTrailLoading(false));

      return null;
    }
  };
};

export default trailSlice.reducer;
