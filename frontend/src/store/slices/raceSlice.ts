import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import {
  type NewRaceValuesType,
  toRaceDetails
} from '../../models/race';
import { ApplicationError } from '../../errors/applicationError';
import { type ReplaceField } from '../../types';
import raceService from '../../services/raceService';
import { raceValuesToRaceArguments } from '../../schemas/race';

import {
  type RaceData,
  type RacePatchResponseData,
} from '@common/types/rest_api';
import {
  type RaceDetails,
  type RaceListing
} from '@common/types/race';

interface RaceSliceRaces {
  races: RaceListing[];
  loading: boolean;
  error: string | null;
}

interface RaceSliceRace {
  selectedRace: RaceData | null;
  loading: boolean;
  error: string | null;
}

interface RaceSliceSubmitNewRace {
  loading: boolean;
  error: string | null;
}

export interface RaceState {
  races: RaceSliceRaces;
  race: RaceSliceRace;
  submitNewRace: RaceSliceSubmitNewRace;
}

const initialState: RaceState = {
  races: {
    races: [],
    loading: false,
    error: null,
  },
  submitNewRace: {
    loading: false,
    error: null,
  },
  race: {
    selectedRace: null,
    loading: false,
    error: null,
  },
};

export const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    appendNewSubmittedRace: (state, action: PayloadAction<RaceListing>) => {
      state.races.races = [...state.races.races, action.payload];
      state.submitNewRace = {
        loading: false,
        error: null,
      };
    },
    setRacesAfterSuccesfullGet: (state, action: PayloadAction<RaceListing[]>) => {
      state.races.races = action.payload;
      state.races.error = null;
    },
    setRacesLoading: (state, action: PayloadAction<boolean>) => {
      state.races.loading = action.payload;
    },
    setRacesLoadingError: (state, action: PayloadAction<string | null>) => {
      state.races.error = action.payload;
    },
    setSubmitNewRaceLoading: (state, action: PayloadAction<boolean>) => {
      state.submitNewRace.loading = action.payload;
    },
    setSubmitNewRaceError: (state, action: PayloadAction<string | null>) => {
      state.submitNewRace.error = action.payload;
    },
    setRace: (state, action: PayloadAction<RaceSliceRace>) => {
      state.race = action.payload;
    },
    setRaceFetching: (state) => {
      state.race = {
        selectedRace: null,
        loading: true,
        error: null,
      };
    },
    patchSelectedRace: (state, action: PayloadAction<RacePatchResponseData>) => {
      state.race.selectedRace = action.payload.raceData;
      state.races.races = state.races.races.map(race =>
        race.id !== action.payload.raceListing.id
          ? race
          : action.payload.raceListing
      );
    },
    removeRace: (state, action: PayloadAction<{ raceId: number }>) => {
      if (action.payload.raceId === state.race.selectedRace?.id) {
        state.race = {
          selectedRace: null,
          loading: false,
          error: null,
        };
      }
      state.races.races = state.races.races.filter(race => race.id !== action.payload.raceId);
    },
  }
});

const {
  appendNewSubmittedRace,
  setRacesAfterSuccesfullGet,
  setRacesLoading,
  setRacesLoadingError,
  setSubmitNewRaceLoading,
  setSubmitNewRaceError,
  setRace,
  setRaceFetching,
  patchSelectedRace,
  removeRace,
} = raceSlice.actions;

export const SelectRaces = (state: RootState): RaceSliceRaces => state.race.races;

export const SelectSubmitNewRace = (state: RootState): RaceSliceSubmitNewRace => state.race.submitNewRace;

export const SelectRace = (state: RootState): ReplaceField<RaceSliceRace, 'selectedRace', RaceDetails | null> => ({
  ...state.race.race,
  selectedRace: state.race.race.selectedRace ? toRaceDetails(state.race.race.selectedRace) : null,
});

export const initializeRaces = (): AppAsyncThunk => {
  return async (dispatch) => {
    dispatch(setRacesLoading(true));

    try {
      const races = await raceService.getAll();
      dispatch(setRacesAfterSuccesfullGet(races));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setRacesLoadingError(error.message));
      } else {
        dispatch(setRacesLoadingError('Unknown error happened while loading races'));
        console.error('unhandled get races error:', error);
      }
    }

    dispatch(setRacesLoading(false));
  };
};

export const submitNewRace = (values: NewRaceValuesType): AppAsyncThunk<number | null> => {
  return async (dispatch) => {
    dispatch(setSubmitNewRaceLoading(true));
    try {
      const newRace = await raceService.create(raceValuesToRaceArguments(values));
      dispatch(appendNewSubmittedRace(newRace));

      return newRace.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setSubmitNewRaceError(error.message));
      } else {
        dispatch(setSubmitNewRaceError('Unknown error happened while creating race'));
        console.error('unhandled post new race error:', error);
      }
      dispatch(setSubmitNewRaceLoading(false));

      return null;
    }
  };
};

export const submitPatchRace = (raceId: number, values: NewRaceValuesType): AppAsyncThunk<string | null> => {
  return async (dispatch, getState) => {
    const stateRace = getState().race.race;
    if (!stateRace.selectedRace || stateRace.selectedRace.id !== raceId) {
      console.error('attempted to patch a race that is not selected');
      return 'Unknown error happened when trying to edit race details. Please try again!';
    }

    const changedFields = raceValuesToRaceArguments(values, stateRace.selectedRace);
    if (!changedFields) {
      return null;
    }

    try {
      const updatedRace = await raceService.updateOne(raceId.toString(), changedFields);
      dispatch(patchSelectedRace(updatedRace));
      return null;
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error.message;
      } else {
        console.error('updating race:', error);
        return 'Unknown error happened when deleting race';
      }
    }
  };
};

export const fetchRace = (raceId: number): AppAsyncThunk => {
  return async (dispatch, getState) => {
    if (getState().race.race.selectedRace?.id === raceId) {
      return;
    }
    dispatch(setRaceFetching());

    try {
      const raceData = await raceService.getOne(raceId.toString());
      dispatch(setRace({
        selectedRace: raceData,
        loading: false,
        error: null
      }));
    } catch (error: unknown) {
      const errMsg: string = error instanceof Error ? error.message : `${error}`;
      console.error('fetching race:', errMsg);
      dispatch(setRace({
        selectedRace: null,
        loading: false,
        error: errMsg,
      }));
    }
  };
};

export const deleteRace = (raceId: number): AppAsyncThunk<string | null> => {
  return async (dispatch) => {
    try {
      await raceService.deleteOne(raceId.toString());
      dispatch(removeRace({ raceId }));
      return null;
    } catch (error: unknown) {
      if (error instanceof ApplicationError) {
        return error.message;
      } else {
        console.error('deleting race:', error);
        return 'Unknown error happened when deleting race';
      }
    }
  };
};

export default raceSlice.reducer;
