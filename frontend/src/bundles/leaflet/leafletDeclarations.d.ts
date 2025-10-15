import 'leaflet';
import type {
  ChangedUserGeoPosStatusCallback,
  CurrentPositionChangeCallback,
  CurrentPositionEventMap,
  LatLngType,
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
      constructor(options?: L.ControlOptions);

      onUserGeoPosStatusChange: ChangedUserGeoPosStatusCallback;
    }

    declare class GroupedControls extends L.Control {
      constructor(options?: L.ControlOptions);

      appendControlElement: (control: HTMLElement) => HTMLElement | undefined;
    }

    declare class OnScreenDisplay extends L.Control {
      constructor(
        options?: L.Control.OnScreenDisplayOptions
      );

      onNewUserGeoPos: CurrentPositionChangeCallback;
    }

    declare class VesselMarker extends L.Control {
      constructor(options?: L.ControlOptions);
    }

    declare class VesselTrailControl extends L.Control {
      constructor(options?: L.ControlOptions);

      updateIcon: () => void;
    }
  }

  namespace control {
    declare function centerMapToLocation(
      options?: L.ControlOptions
    ): L.Control.CenterMaptoLocation;

    declare function groupedControls(
      options?: L.ControlOptions
    ): L.Control.GroupedControls;

    declare function onScreenDisplay(
      options?: L.Control.OnScreenDisplayOptions
    ): L.Control.OnScreenDisplay;

    declare function vesselMarker(
      options?: L.ControlOptions
    ): L.Control.VesselMarker;

    declare function vesselTrailControl(
      options?: L.ControlOptions
    ): L.Control.VesselTrailControl;
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

  interface VelocityVectorOptions {
    lengthMinutes?: number;
    segmentsCount?: number;
    segmentColors?: {
      first?: `#${string}`;
      second?: `#${string}`;
    };
    overlayPosition?: L.ControlOptions['position'];
  }

  declare class VelocityVector {
    static readonly RenderPane: string;

    constructor(options?: VelocityVectorOptions);

    addTo(map: GosaGoraMap): void;
    onNewUserGeoPos(newCurrenPosition: LatLngType | null): void;
  }

  declare class VesselTrail extends Polyline {
    constructor(
      latlngs?: LatLngExpression[][],
      options?: PolylineOptions
    );
  }

  declare function velocityVector(
    options?: VelocityVectorOptions
  ): VelocityVector;

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

  interface GosaGoraMapOptions extends L.MapOptions {
    centerMapToLocation?: L.Control.CenterMaptoLocation;
    onScreenDisplay?: L.Control.OnScreenDisplay;
    vesselTrail?: VesselTrail;
    vesselTrailControl?: L.Control.VesselTrailControl;
    vesselMarkerControl?: L.Control.VesselMarker;
  }

  declare class GosaGoraMap extends L.Map {
    constructor(
      element: string | HTMLElement,
      options?: GosaGoraMapOptions
    );

    appendControlElementToGroupedControls: L.Control.GroupedControls['appendControlElement'];
    getCurrentGeoPos: () => LatLngType | null;
    setIsTrackingCurrentPosition: (trackCurrentPosition: boolean) => void;
    subscribeCurrentPositionChangeCallback: (cb: CurrentPositionChangeCallback) => void;
    unsubscribeCurrentPositionChangeCallback: (cb: CurrentPositionChangeCallback) => void;
    isVesselMarkerTrailEnabled: () => boolean;
    setIsVesselMarkerTrailEnabled: (enableVesselMarkerTrail: boolean) => void;
  }
}
