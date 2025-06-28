import {
  type Action,
  type ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';

import raceReducer from './slices/raceSlice';

const store = configureStore({
  reducer: {
    race: raceReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

export type AppAsyncThunk<ThunkReturnType = void> = ThunkAction<
  Promise<ThunkReturnType>,
  RootState,
  unknown,
  Action
>;

export default store;
