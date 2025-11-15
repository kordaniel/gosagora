import {
  type Action,
  type ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import boatReducer from './slices/boatSlice';
import locationSlice from './slices/locationSlice';
import raceReducer from './slices/raceSlice';
import trailReducer from './slices/trailSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    boat: boatReducer,
    location: locationSlice,
    race: raceReducer,
    trail: trailReducer,
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
