import {
  type PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import {
  type NewTrailValuesType,
  toTrailDetails,
  toTrailListing,
} from '../../models/trail';
import { type ReplaceField } from '../../types';
import trailService from '../../services/trailService';
import { trailValuesToTrailArguments } from '../../schemas/trail';

import type {
  TrailData,
  TrailListingData,
} from '@common/types/rest_api';
import type {
  TrailDetails,
  TrailListing,
} from '@common/types/trail';

interface TrailSliceTrails {
  trails: TrailListingData[];
  loading: boolean;
  error: string | null;
}

interface TrailSliceTrail {
  error: string | null;
  loading: boolean;
  selectedTrail: TrailData | null;
}

interface TrailSliceSubmitNewTrail {
  error: string | null;
  loading: boolean;
}

interface TrailState {
  trails: TrailSliceTrails;
  trail: TrailSliceTrail;
  submitNewTrail: TrailSliceSubmitNewTrail;
}

const initialState: TrailState = {
  trails: {
    error: null,
    loading: false,
    trails: [],
  },
  trail: {
    error: null,
    loading: false,
    selectedTrail: null,
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
    setTrail: (state, action: PayloadAction<TrailSliceTrail>) => {
      state.trail = action.payload;
    },
    setTrailFetching: (state) => {
      state.trail = {
        selectedTrail: null,
        loading: true,
        error: null,
      };
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
  setTrail,
  setTrailFetching,
  setTrailsError,
  setTrailsLoading,
  setTrailsTrailsAfterSuccessfullGet,
} = trailSlice.actions;

export const SelectSubmitNewTrail = (state: RootState): TrailSliceSubmitNewTrail => state.trail.submitNewTrail;

export const SelectTrail = createSelector(
  (state: RootState) => state.trail.trail,
  (trail: TrailSliceTrail): ReplaceField<TrailSliceTrail, 'selectedTrail', TrailDetails | null> => ({
    ...trail,
    selectedTrail: trail.selectedTrail ? toTrailDetails(trail.selectedTrail) : null,
  }),
);

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

export const fetchTrail = (trailId: number): AppAsyncThunk => {
  return async (dispatch, getState) => {
    if (getState().trail.trail.selectedTrail?.id === trailId) {
      return;
    }
    dispatch(setTrailFetching());

    try {
      const trailData = await trailService.getOne(trailId.toString());
      dispatch(setTrail({
        selectedTrail: trailData,
        error: null,
        loading: false,
      }));
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : `${error}`;
      console.error('fetching trail:', errMsg);
      dispatch(setTrail({
        selectedTrail: null,
        error: errMsg,
        loading: false,
      }));
    }
  };
};

export default trailSlice.reducer;
