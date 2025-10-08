/* eslint-disable @typescript-eslint/no-namespace */

import L from 'leaflet';

import type { MapStateConnection } from './leafletTypes';

declare module 'leaflet' {

  interface VesselMarkerOptions extends L.ControlOptions {}

  namespace Control {
    class CenterMaptoLocation extends L.Control {
      constructor(
        getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
        options?: L.ControlOptions
      );
    }

    class VesselMarker extends L.Control {
      constructor(
        mapStateConnection: MapStateConnection,
        options?: L.VesselMarkerOptions
      );
    }
  }

  namespace control {
    function centerMapToLocation(
      getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
      options?: L.ControlOptions
    ): L.Control.CenterMaptoLocation;

    function vesselMarker(
      mapStateConnection: MapStateConnection,
      options?: L.VesselMarkerOptions
    ): L.Control.VesselMarker;
  }
}

class CenterMapToLocation extends L.Control {

  private _map?: L.Map;
  private _getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'];

  constructor(
    getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
    options?: L.ControlOptions
  ) {
    super(options);
    this._getCurrentGeoPos = getCurrentGeoPos;
  }

  override onAdd(map: L.Map): HTMLElement {
    this._map = map;
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
    const icon = L.DomUtil.create('span', 'leaflet-control-center-map-to', link);
    link.href = '#';

    L.DomEvent.on(link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      const currentGeoPos = this._getCurrentGeoPos();
      if (this._map && currentGeoPos) {
        this._map.panTo([currentGeoPos.lat, currentGeoPos.lng]);
      } // TODO: else => request location, show spinner/err icon
    });
    return container;
  }
}

class VesselMarker extends L.Control {

  private _map?: L.Map;
  private _container?: HTMLDivElement;
  private _link?: HTMLAnchorElement;
  private _icon?: HTMLSpanElement;
  //private _status: 'requesting' | 'locating' | 'following' | 'idle';

  private _mapStateConnection: MapStateConnection;

  constructor(mapStateConnection: MapStateConnection, options?: L.VesselMarkerOptions) {
    super(options);
    this._mapStateConnection = mapStateConnection;
    //this._status = 'idle';
  }

  override onAdd(map: L.Map): HTMLElement {
    this._map = map;
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', this._container);
    this._icon = L.DomUtil.create('span', 'leaflet-control-boating-arrow', this._link);
    this._link.href = '#';

    L.DomEvent.on(this._link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      this._onClick();
    }, this);

    return this._container;
  }

  /*
  private _isRequesting() {
    if (!this._icon) {
      return false;
    }
    return this._icon.classList.contains('requesting');
  }

  private _isLocating() {
    if (!this._icon) {
      return false;
    }
    return this._icon.classList.contains('locating');
  }

  private _isFollowing() {
    if (!this._icon) {
      return false;
    }
    return this._icon.classList.contains('following');
  }
  */

  private _onClick() {
    console.log('click');

    if (this._mapStateConnection.isTrackingCurrentPosition()) {
      this._icon?.classList.remove('following');
      this._mapStateConnection.setIsTrackingCurrentPosition(false);
    } else {
      this._icon?.classList.add('following');
      this._mapStateConnection.setIsTrackingCurrentPosition(true);
    }

    /*
    if (this._isFollowing()) {
      this._icon?.classList.remove('following');
      return;
    }

    const pos = this._mapStateConnection.getCurrentGeoPos();
    console.log('pos:', pos);

    if (this._isLocating()) {
      this._icon?.classList.remove('locating');
    } else if (this._isRequesting()) {
      this._icon?.classList.remove('requesting');
    } else if (pos) {
      this._icon?.classList.add('following');
    } else {
      this._icon?.classList.add('requesting');
    }
    */
  }
}

export default {
  CenterMapToLocation,
  VesselMarker,
};
