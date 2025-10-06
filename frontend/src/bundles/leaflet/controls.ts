/* eslint-disable @typescript-eslint/no-namespace */

import L from 'leaflet';

declare module 'leaflet' {
  export interface VesselMarkerOptions extends L.ControlOptions {}

  namespace Control {
    class VesselMarker extends L.Control {
      constructor(options?: L.VesselMarkerOptions);
    }
  }

  namespace control {
    function vesselMarker(options?: L.VesselMarkerOptions): L.Control.VesselMarker;
  }
}

export default class VesselMarker extends L.Control {

  private _map?: L.Map;
  private _container?: HTMLDivElement;
  private _link?: HTMLAnchorElement;
  private _icon?: HTMLSpanElement;
  //private _status: 'requesting' | 'locating' | 'following' | 'idle';

  constructor(options?: L.VesselMarkerOptions) {
    super(options);
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

  private _onClick() {
    console.log('click');

    if (this._isFollowing()) {
      this._icon?.classList.remove('following');
    } else if (this._isLocating()) {
      this._icon?.classList.remove('locating');
    } else if (this._isRequesting()) {
      this._icon?.classList.remove('requesting');
    } else {
      this._icon?.classList.add('requesting');
    }
  }
}
