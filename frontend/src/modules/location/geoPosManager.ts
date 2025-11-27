import type { GeoPos } from '../../types';
import { LocationWindowBuffer } from './helpers';
import { clampNumber } from '../../utils/helpers';

// https://react.dev/reference/react/useSyncExternalStore

interface LocationTrackingStatus {
  error: string | null;
  state: 'idle' | 'background' | 'foreground' | 'foreground-simulated';
}

interface TrackingTrailStatus {
  id: number;
  startIdx: number;
  endIdx: number;
}

let currentPositionSubscribers: Array<() => void> = [];
let subscribers: Array<() => void> = [];

let trackingTrailStatus: TrackingTrailStatus | null = null;
let locationTrackingStatus: LocationTrackingStatus = {
  error: null,
  state: 'idle',
};

const locationWindowBuffer = new LocationWindowBuffer();
const history: Array<GeoPos | null> = []; // TODO: Replace with ringbuffer
const historyMaxLength: number = 3000; // TODO: Cut by MAX(minutes, array length)
const historyTrimLength: number = clampNumber(Math.round(0.1 * historyMaxLength), 1, 500);

/* ----- \/ Default exported functions \/ ----- */

const addPosition = (position: GeoPos | null, emitChange: boolean = true) => {
  const pos = position !== null ? locationWindowBuffer.addPosition(position) : null;

  if (pos !== null || historyIsEmpty() || history.at(-1) !== null) {
    trimHistoryLength();
    history.push(pos);
    if (trackingTrailStatus) {
      trackingTrailStatus.endIdx = history.length-1;
    }
    if (emitChange) {
      emitCurrentPositionChange();
    }
  }
};

const addPositions = (positions: Array<GeoPos | null>) => {
  positions.forEach((pos, i) => {
    const emitChange = !(i+1 < positions.length && positions[i+1] !== null);
    addPosition(pos, emitChange);
  });
};

const getCurrentPosition = (): GeoPos | null => {
  const lastPosition = history.at(-1);
  return lastPosition ? Object.freeze(lastPosition) : null; // TODO: Cache current position
};

const getHistory = (): Array<GeoPos | null> => {
  return history.slice();
};

const getLocationTrackingStatus = (): LocationTrackingStatus => {
  return locationTrackingStatus;
};

const getTrackingTrailId = (): number | null => {
  if (!trackingTrailStatus) {
    return null;
  }
  return trackingTrailStatus.id;
};

const isTrackingTrail = (): boolean => {
  return trackingTrailStatus !== null;
};

const setLocationTrackingError = (error: LocationTrackingStatus['error']) => {
  locationTrackingStatus = {
    ...locationTrackingStatus,
    error,
  };
  emitChange();
};

const setLocationTrackingState = (state: LocationTrackingStatus['state']) => {
  locationTrackingStatus = {
    ...locationTrackingStatus,
    state,
  };
  emitChange();
};

const setLocationTrackingStatus = (newStatus: LocationTrackingStatus) => {
  locationTrackingStatus = newStatus;
  emitChange();
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

const subscribeToCurrentPosition = (listener: () => void) => {
  currentPositionSubscribers = currentPositionSubscribers.concat(listener);
  return () => {
    currentPositionSubscribers = currentPositionSubscribers.filter(l => l !== listener);
  };
};

/* ----- /\ Default exported functions /\ ----- */

const historyIsEmpty = () => {
  return history.length === 0;
};

const emitChange = () => {
  subscribers.forEach(listener => listener());
};

const emitCurrentPositionChange = () => {
  currentPositionSubscribers.forEach(listener => listener());
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
  getCurrentPosition,
  getHistory,
  getLocationTrackingStatus,
  getTrackingTrailId,
  isTrackingTrail,
  setLocationTrackingError,
  setLocationTrackingState,
  setLocationTrackingStatus,
  startTrackingTrail,
  stopTrackingTrail,
  subscribe,
  subscribeToCurrentPosition,
};
