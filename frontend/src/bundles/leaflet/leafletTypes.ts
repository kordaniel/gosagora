import type { LeafletEvent } from 'leaflet';

import type { GeoPos } from '../../types';

export interface LatLngType extends Omit<GeoPos, 'lon'> {
  lng: number;
}

export interface MapStateConnection {
  getCurrentGeoPos: () => LatLngType | null;
  isTrackingCurrentPosition: () => boolean;
  setIsTrackingCurrentPosition: (trackCurrentPosition: boolean) => void;
}

export type UserGeoPosStatus = 'IS_KNOWN' | 'IS_UNKNOWN';
export type ChangedUserGeoPosStatusCallback = (newUserGeoPosStatus: UserGeoPosStatus) => void;

export interface GeoPosUpdateEvent extends Pick<LeafletEvent, 'type'> {
  type: 'mapState:userGeoPosChange',
  payload: {
    currentPosition: LatLngType | null;
    userGeoPosStatus: UserGeoPosStatus, // TODO: Add requesting / waiting..
  }
}
