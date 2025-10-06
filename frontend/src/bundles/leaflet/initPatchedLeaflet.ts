import 'leaflet.fullscreen';
import L, {
  type VesselMarkerOptions
} from 'leaflet';

import type { GeoPos } from '../../types';
import VesselMarker from './controls';

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (data: string) => void;
    };
  }

  interface DocumentEventMap {
    message: MessageEvent;
  }
}

export interface LatLngType extends Omit<GeoPos, 'lon'> {
  lng: number;
}

L.Control.VesselMarker = VesselMarker;
L.control.vesselMarker = function(options?: VesselMarkerOptions) {
  return new L.Control.VesselMarker(options);
};

export default L;
