import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import { NewSailboatValuesType } from '../../models/boat';
import { authSliceAddUserBoatIdentity } from './authSlice';
import boatService from '../../services/boatService';
import { newSailboatValuesToCreateSailboatArguments } from '../../schemas/boat';

import type { SailboatData } from '@common/types/rest_api';

interface BoatSliceSelectedBoat {
  boat: SailboatData | null;
  error: string | null;
  loading: boolean;
}

interface BoatSliceSubmitNewBoat {
  loading: boolean;
  error: string | null;
}

export interface BoatState {
  selectedBoat: BoatSliceSelectedBoat;
  submitNewBoat: BoatSliceSubmitNewBoat
}

const initialState: BoatState = {
  selectedBoat:{
    boat: null,
    error: null,
    loading: false,
  },
  submitNewBoat: {
    error: null,
    loading: false,
  },
};

export const boatSlice = createSlice({
  name: 'boat',
  initialState,
  reducers: {
    setSelectedBoat: (state, action: PayloadAction<SailboatData | null>) => {
      state.selectedBoat.boat = action.payload;
    },
    setSelectedBoatError: (state, action: PayloadAction<string | null>) => {
      state.selectedBoat.error = action.payload;
    },
    setSelectedBoatLoading: (state, action: PayloadAction<boolean>) => {
      state.selectedBoat.loading = action.payload;
    },
    setSubmitNewBoatError: (state, action: PayloadAction<string | null>) => {
      state.submitNewBoat.error = action.payload;
    },
    setSubmitNewBoatLoading: (state, action: PayloadAction<boolean>) => {
      state.submitNewBoat.loading = action.payload;
    },
  },
});

export const {
  setSubmitNewBoatError: boatSliceSetSubmitNewBoatError,
} = boatSlice.actions;

const {
  setSelectedBoat,
  setSelectedBoatError,
  setSelectedBoatLoading,
  setSubmitNewBoatLoading,
} = boatSlice.actions;

export const SelectSelectedBoat = (state: RootState): BoatSliceSelectedBoat => state.boat.selectedBoat;
export const SelectSubmitNewBoat = (state: RootState): BoatSliceSubmitNewBoat => state.boat.submitNewBoat;

export const fetchBoat = (boatId: number): AppAsyncThunk => {
  return async (dispatch) => {
    dispatch(setSelectedBoatLoading(true));

    try {
      const boatData = await boatService.getOne(boatId.toString());
      dispatch(setSelectedBoatError(null));
      dispatch(setSelectedBoat(boatData));
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : `${error}`;
      console.error('fetching boat:', errMsg);
      dispatch(setSelectedBoat(null));
      dispatch(setSelectedBoatError(errMsg));
    }

    dispatch(setSelectedBoatLoading(false));
  };
};

export const submitNewBoat = (values: NewSailboatValuesType): AppAsyncThunk<number | null> => {
  return async (dispatch) => {
    dispatch(setSubmitNewBoatLoading(true));

    try {
      const data = await boatService.createSailboat(newSailboatValuesToCreateSailboatArguments(values));
      dispatch(setSelectedBoat(data.boat));
      dispatch(authSliceAddUserBoatIdentity(data.boatIdentity));
      dispatch(boatSliceSetSubmitNewBoatError(null));
      dispatch(setSubmitNewBoatLoading(false));

      return data.boat.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(boatSliceSetSubmitNewBoatError(error.message));
      } else {
        dispatch(boatSliceSetSubmitNewBoatError('Unknown error happened while creating new boat'));
        console.error('unhandled post new boat error:', error);
      }
      dispatch(setSubmitNewBoatLoading(false));

      return null;
    }
  };
};

export default boatSlice.reducer;
