import 'leaflet.fullscreen';
import L, {
  type VesselMarkerOptions,
} from 'leaflet';

import type { MapStateConnection } from './leafletTypes';
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

L.Control.VesselMarker = VesselMarker;
L.control.vesselMarker = function(
  mapStateConnection: MapStateConnection,
  options?: VesselMarkerOptions
) {
  return new L.Control.VesselMarker(mapStateConnection, options);
};

export default L;
