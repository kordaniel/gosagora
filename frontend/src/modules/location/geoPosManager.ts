import type { GeoPos } from '../../types';
import { LocationWindowBuffer } from './helpers';
import { clampNumber } from '../../utils/helpers';
import { handleNewLocation } from '../../store/slices/locationSlice';
import store from '../../store';

const locationWindowBuffer = new LocationWindowBuffer();
const history: Array<GeoPos | null> = []; // TODO: Replace with ringbuffer
const historyMaxLength: number = 30_000; // TODO: Cut by MAX(minutes, array length)
const historyTrimLength: number = clampNumber(Math.round(0.1 * historyMaxLength), 1, 500);

/* ----- \/ Default exported functions \/ ----- */

const addPosition = (position: GeoPos | null, dispatchToStore: boolean = true) => {
  trimHistoryLength();

  if (position === null) {
    if (historyIsEmpty() || history.at(-1) !== null) {
      history.push(position);
      if (dispatchToStore) {
        store.dispatch(handleNewLocation(position));
      }
    }
    return;
  }

  const pos = locationWindowBuffer.addPosition(position);

  if (pos === null) {
    if (historyIsEmpty() || history.at(-1) !== null) {
      history.push(pos);
      if (dispatchToStore) {
        store.dispatch(handleNewLocation(pos));
      }
    }
  } else {
    history.push(pos);
    if (dispatchToStore) {
      store.dispatch(handleNewLocation(pos));
    }
  }
};

const addPositions = (positions: Array<GeoPos | null>) => {
  for (let i = 0; i < positions.length; i++) {
    const dispatchToStore = !(i+1 < positions.length && positions[i+1] !== null);
    addPosition(positions[i], dispatchToStore);
  }
};

const getHistory = (): Array<GeoPos | null> => {
  return history.slice();
};

const getLastPosition = (): GeoPos | null => {
  if (historyIsEmpty()) {
    return null;
  }
  return history[history.length - 1];
};

/* ----- /\ Default exported functions /\ ----- */

const historyIsEmpty = () => {
  return history.length === 0;
};

const trimHistoryLength = () => {
  if (history.length < historyMaxLength) {
    return;
  }
  history.splice(0, historyTrimLength);
};

export default {
  addPosition,
  addPositions,
  getHistory,
  getLastPosition,
};
