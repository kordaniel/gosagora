import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import {
  authSliceAddUserBoatIdentity,
  authSliceRemoveUserBoatIdentity,
  authSliceUpdateUserBoatIdentity
} from './authSlice';
import { ApplicationError } from '../../errors/applicationError';
import { type NewSailboatValuesType } from '../../models/boat';
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

export const submitPatchBoat = (boatId: number, values: NewSailboatValuesType): AppAsyncThunk<string | null> => {
  return async (dispatch, getState) => {
    const stateSelectedBoat = getState().boat.selectedBoat;
    if (!stateSelectedBoat.boat || stateSelectedBoat.boat.id !== boatId) {
      console.error('attempted to patch a boat that is not selected');
      return 'Unknown error happened when trying to edit boat details. Please try again!';
    }

    const changedFields = newSailboatValuesToCreateSailboatArguments(values, stateSelectedBoat.boat);
    if (!changedFields) {
      return null;
    }

    try {
      const updatedBoat = await boatService.updateOne(boatId.toString(), changedFields);
      dispatch(setSelectedBoat(updatedBoat.boat));
      dispatch(authSliceUpdateUserBoatIdentity(updatedBoat.boatIdentity));
      return null;
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error.message;
      } else {
        console.error('updating boat:', error);
        return 'Unknown error happened when updating boat';
      }
    }
  };
};

export const deleteAuthorizedUsersUserSailboats = (boatId: number): AppAsyncThunk<string | null> => {
  return async (dispatch, getState) => {
    const stateAuth = getState().auth;
    if (!stateAuth.isInitialized || !stateAuth.user) {
      return 'Please Sign In to perform this action';
    }
    try {
      await boatService.deleteOneUserSailboats(boatId.toString(), stateAuth.user.id.toString());
      dispatch(setSelectedBoat(null));
      dispatch(authSliceRemoveUserBoatIdentity({ id: boatId }));
      return null;
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error.message;
      } else {
        console.log('deleting userSailboats:', error);
        return 'Unknown error happened when deleting boat';
      }
    }
  };
};

export default boatSlice.reducer;
