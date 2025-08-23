import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import boatService from '../../services/boatService';

import { type SailboatData } from '@common/types/rest_api';

export interface BoatState {
  selectedBoat: SailboatData | null;
  error: string | null;
  loading: boolean;
}

const initialState: BoatState = {
  selectedBoat: null,
  error: null,
  loading: false,
};

export const boatSlice = createSlice({
  name: 'boat',
  initialState,
  reducers: {
    setSelectedBoat: (state, action: PayloadAction<SailboatData | null>) => {
      state.selectedBoat = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

const {
  setSelectedBoat,
  setError,
  setLoading,
} = boatSlice.actions;

export const SelectSelectedBoat = (state: RootState) => ({
  ...state.boat,
});

export const fetchBoat = (boatId: number): AppAsyncThunk => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const boatData = await boatService.getOne(boatId.toString());
      dispatch(setError(null));
      dispatch(setSelectedBoat(boatData));
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : `${error}`;
      console.error('fetching boat:', errMsg);
      dispatch(setSelectedBoat(null));
      dispatch(setError(errMsg));
    }

    dispatch(setLoading(false));
  };
};

export default boatSlice.reducer;
