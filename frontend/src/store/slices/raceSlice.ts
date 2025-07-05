import {
  type PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppAsyncThunk, RootState } from '../index';
import type { DateRange, NonNullableFields } from '../../types';
import raceService from '../../services/raceService';
import { toRaceDetails } from '../../models/race';

import type {
  CreateRaceArguments,
  RaceData,
} from '@common/types/rest_api';
import {
  RaceListing,
} from '@common/types/race';

export type NewRaceValuesType = NonNullableFields<Omit<CreateRaceArguments,
  'public' | 'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'
>> & {
  startEndDateRange: DateRange;
  registrationStartEndDateRange: DateRange;
};

interface RaceSliceRace {
  selectedRace: RaceData | null;
  loading: boolean;
  error: string | null;
}

export interface RaceState {
  races: RaceListing[];
  racesLoading: boolean;
  racesLoadingError: string | null;
  submittingNewRaceLoading: boolean;
  submittingNewRaceError: string | null;
  race: RaceSliceRace;
}

const initialState: RaceState = {
  races: [],
  racesLoading: false,
  racesLoadingError: null,
  submittingNewRaceLoading: false,
  submittingNewRaceError: null,
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
      state.races = [...state.races, action.payload];
      state.submittingNewRaceError = null;
    },
    setRacesAfterSuccesfullGet: (state, action: PayloadAction<RaceListing[]>) => {
      state.races = action.payload;
      state.racesLoadingError = null;
    },
    setRacesLoading: (state, action: PayloadAction<boolean>) => {
      state.racesLoading = action.payload;
    },
    setRacesLoadingError: (state, action: PayloadAction<string | null>) => {
      state.racesLoadingError = action.payload;
    },
    setSubmittingNewRaceLoading: (state, action: PayloadAction<boolean>) => {
      state.submittingNewRaceLoading = action.payload;
    },
    setSubmittingNewRaceError: (state, action: PayloadAction<string | null>) => {
      state.submittingNewRaceError = action.payload;
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
  }
});

const {
  appendNewSubmittedRace,
  setRacesAfterSuccesfullGet,
  setRacesLoading,
  setRacesLoadingError,
  setSubmittingNewRaceLoading,
  setSubmittingNewRaceError,
  setRace,
  setRaceFetching,
} = raceSlice.actions;

export const SelectRaces = (state: RootState) => ({
  races: state.race.races,
  racesLoading: state.race.racesLoading,
  racesLoadingError: state.race.racesLoadingError,
});

export const SelectSubmittingNewRace = (state: RootState) => ({
  setSubmittingNewRaceLoading: state.race.submittingNewRaceLoading,
  submittingNewRaceError: state.race.submittingNewRaceError,
});

export const SelectRace = (state: RootState) => ({
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
    dispatch(setSubmittingNewRaceLoading(true));

    try {
      const newRace = await raceService.create({
        name: values.name.trim(),
        type: values.type,
        url: values.url ? values.url.trim() : null,
        email: values.email ? values.email.trim() : null,
        dateFrom: values.startEndDateRange.startDate.toISOString(),
        dateTo: values.startEndDateRange.endDate.toISOString(),
        registrationOpenDate: values.registrationStartEndDateRange.startDate.toISOString(),
        registrationCloseDate: values.registrationStartEndDateRange.endDate.toISOString(),
        description: values.description.trim(),
      });
      dispatch(appendNewSubmittedRace(newRace));
      dispatch(setSubmittingNewRaceLoading(false));

      return newRace.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setSubmittingNewRaceError(error.message));
      } else {
        dispatch(setSubmittingNewRaceError('Unknown error happened while creating race'));
        console.error('unhandled post new race error:', error);
      }
      dispatch(setSubmittingNewRaceLoading(false));

      return null;
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
      console.error('Fetching races:', errMsg);
      dispatch(setRace({
        selectedRace: null,
        loading: false,
        error: errMsg,
      }));
    }
  };

};

export default raceSlice.reducer;
