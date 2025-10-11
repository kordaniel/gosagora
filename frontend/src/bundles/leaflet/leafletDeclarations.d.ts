import 'leaflet';
import type {
  ChangedUserGeoPosStatusCallback,
  CurrentPositionChangeCallback,
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
  namespace Control {
    interface OnScreenDisplayOptions extends L.ControlOptions {
      overlayPosition?: L.ControlOptions['position'];
    }

    declare class CenterMaptoLocation extends L.Control {
      constructor(
        getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
        options?: L.ControlOptions
      );

      onUserGeoPosStatusChange: ChangedUserGeoPosStatusCallback;
    }

    declare class OnScreenDisplay extends L.Control {
      constructor(
        getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
        options?: L.Control.OnScreenDisplayOptions
      );

      onNewUserGeoPos: CurrentPositionChangeCallback;
    }

    declare class VesselMarker extends L.Control {
      constructor(
        mapStateConnection: MapStateConnection,
        options?: L.ControlOptions
      );
    }
  }

  namespace control {
    declare function centerMapToLocation(
      getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
      options?: L.ControlOptions
    ): L.Control.CenterMaptoLocation;

    declare function onScreenDisplay(
      getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
      options?: L.Control.OnScreenDisplayOptions
    ): L.Control.OnScreenDisplay;

    declare function vesselMarker(
      mapStateConnection: MapStateConnection,
      options?: L.ControlOptions
    ): L.Control.VesselMarker;
  }

  namespace Marker {
    interface VesselMarkerOptions extends L.MarkerOptions {
      vesselColor?: `#${string}`;
    }

    declare class VesselMarker extends L.Marker {
      constructor(
        latlng: L.LatLngExpression,
        circle: L.Circle,
        options?: L.Marker.VesselMarkerOptions
      );
    }
  }

  namespace marker {
    declare function vesselMarker(
      latlng: L.LatLngExpression,
      circle: L.Circle,
      options?: L.Marker.VesselMarkerOptions
    ): L.Marker.VesselMarker;
  }

  declare class VesselTrail extends Polyline {
    constructor(
      latlngs?: LatLngExpression[][],
      options?: PolylineOptions
    );
  }

  declare function vesselTrail(
    latlngs?: LatLngExpression[][],
    options?: PolylineOptions
  ): VesselTrail;

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
