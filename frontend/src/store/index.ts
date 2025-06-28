import {
  type Action,
  type ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {},
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

export default store;
