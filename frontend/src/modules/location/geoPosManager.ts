import type { GeoPos } from '../../types';
import { LocationWindowBuffer } from './helpers';
import { clampNumber } from '../../utils/helpers';
import { handleNewLocation } from '../../store/slices/locationSlice';
import store from '../../store';

interface TrackingTrailStatus {
  id: number;
  startIdx: number;
  endIdx: number;
}

let subscribers: Array<() => void> = []; // useSyncExternalStore listeners

const locationWindowBuffer = new LocationWindowBuffer();
const history: Array<GeoPos | null> = []; // TODO: Replace with ringbuffer
const historyMaxLength: number = 3000; // TODO: Cut by MAX(minutes, array length)
const historyTrimLength: number = clampNumber(Math.round(0.1 * historyMaxLength), 1, 500);

let trackingTrailStatus: TrackingTrailStatus | null = null;

/* ----- \/ Default exported functions \/ ----- */

const addPosition = (position: GeoPos | null, dispatchToStore: boolean = true) => {
  const pos = position !== null ? locationWindowBuffer.addPosition(position) : null;
  trimHistoryLength();

  if (pos !== null) {
    history.push(pos);
    if (dispatchToStore) {
      store.dispatch(handleNewLocation(pos));
    }
    if (trackingTrailStatus) {
      trackingTrailStatus.endIdx = history.length-1;
    }
  } else {
    if (historyIsEmpty() || history.at(-1) !== null) {
      history.push(pos);
      if (dispatchToStore) {
        store.dispatch(handleNewLocation(pos));
      }
      if (trackingTrailStatus) {
        trackingTrailStatus.endIdx = history.length-1;
      }
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

const getTrackingTrailId = (): number | null => {
  if (!trackingTrailStatus) {
    return null;
  }
  return trackingTrailStatus.id;
};

//const getTrackingTrailPositions = () => {
//  return [];
//};

const getLastPosition = (): GeoPos | null => {
  if (historyIsEmpty()) {
    return null;
  }
  return history[history.length - 1];
};

const startTrackingTrail = (trailId: number) => {
  // NOTE TODO: idx's can be < 0
  trackingTrailStatus = {
    id: trailId,
    startIdx: history.length - 1,
    endIdx: history.length - 1,
  };
  emitChange();
};

const stopTrackingTrail = () => {
  trackingTrailStatus = null;
  emitChange();
};

const subscribe = (listener: () => void) => {
  subscribers = subscribers.concat(listener);
  return () => {
    subscribers = subscribers.filter(l => l !== listener);
  };
};

/* ----- /\ Default exported functions /\ ----- */

const historyIsEmpty = () => {
  return history.length === 0;
};

const emitChange = () => {
  subscribers.forEach(listener => listener());
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
  getTrackingTrailId,
  //getTrackingTrailPositions,
  getLastPosition,
  startTrackingTrail,
  stopTrackingTrail,
  subscribe,
};
