import 'leaflet';
import type {
  ChangedUserGeoPosStatusCallback,
  CurrentPositionEventMap,
  MapStateConnection,
} from './leafletTypes';

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

declare module 'leaflet' {
  interface VesselMarkerOptions extends L.ControlOptions {}

  namespace Control {
    declare class CenterMaptoLocation extends L.Control {
      constructor(
        getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
        options?: L.ControlOptions
      );

      onUserGeoPosStatusChange: ChangedUserGeoPosStatusCallback;
    }

    declare class VesselMarker extends L.Control {
      constructor(
        mapStateConnection: MapStateConnection,
        options?: L.VesselMarkerOptions
      );
    }
  }

  namespace control {
    declare function centerMapToLocation(
      getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
      options?: L.ControlOptions
    ): L.Control.CenterMaptoLocation;

    declare function vesselMarker(
      mapStateConnection: MapStateConnection,
      options?: L.VesselMarkerOptions
    ): L.Control.VesselMarker;
  }

  namespace Marker {
    declare class VesselMarker extends L.Marker {
      constructor(latlng: L.LatLngExpression, options?: L.MarkerOptions);
    }
  }

  namespace marker {
    declare function vesselMarker(
      latlng: L.LatLngExpression,
      options?: L.MarkerOptions
    ): L.Marker.VesselMarker;
  }

  interface Evented {
    on<K extends keyof CurrentPositionEventMap>(
      type: K,
      fn: (event: { type: K }
        & Pick<L.LeafletEvent, 'sourceTarget' | 'target'>
        & CurrentPositionEventMap[K]
      ) => void,
    ): this;

    fire<K extends keyof CurrentPositionEventMap>(
      type: K,
      data: CurrentPositionEventMap[K],
    ): this;
  }
}
