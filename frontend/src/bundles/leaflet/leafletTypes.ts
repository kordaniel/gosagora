import type { GeoPos } from '../../types';

export interface LatLngType extends Omit<GeoPos, 'lon'> {
  lng: number;
}

export type UserGeoPosStatus = 'IS_KNOWN' | 'IS_UNKNOWN';
export type ChangedUserGeoPosStatusCallback = (newUserGeoPosStatus: UserGeoPosStatus) => void;
export type CurrentPositionChangeCallback = (newCurrentPosition: LatLngType | null) => void;

export interface CurrentPositionEventMap {
  'currentPosition:update': {
    currentPosition: LatLngType | null;
  };
  'currentPositionStatus:change': {
    newCurrentPositionStatus: UserGeoPosStatus;
  };
}
