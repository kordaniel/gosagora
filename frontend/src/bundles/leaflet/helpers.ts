import type { GeoPos } from '../../types';
import type { LatLngType } from './leafletTypes';

export const geoPosToLatLngType = (pos: GeoPos | null): LatLngType | null => {
  return pos === null ? null : {
    ...pos,
    lng: pos.lon
  };
};
