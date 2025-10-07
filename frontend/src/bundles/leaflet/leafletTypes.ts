import type { GeoPos } from '../../types';

export interface LatLngType extends Omit<GeoPos, 'lon'> {
  lng: number;
}

export interface MapStateConnection {
  getCurrentGeoPos: () => LatLngType | null;
  isTrackingCurrentPosition: () => boolean;
  setIsTrackingCurrentPosition: (trackCurrentPosition: boolean) => void;
}
