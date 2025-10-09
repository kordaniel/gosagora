import L from 'leaflet';

import type {
  MapStateConnection,
  UserGeoPosStatus,
} from './leafletTypes';
import { assertNever } from '../../utils/typeguards';

class CenterMapToLocation extends L.Control implements L.Control.CenterMaptoLocation {

  private _map?: L.Map;
  private _getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'];
  private _icon?: HTMLSpanElement;

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
    this._icon = L.DomUtil.create('span', 'leaflet-control-center-map-to disabled', link);
    link.href = '#';

    L.DomEvent.on(link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      const currentGeoPos = this._getCurrentGeoPos();
      if (this._map && currentGeoPos) {
        this._map.setView(
          [currentGeoPos.lat, currentGeoPos.lng],
          Math.max(this._map.getZoom(), 12)
        );
      }
    });

    return container;
  }

  onUserGeoPosStatusChange = (newUserGeoPosStatus: UserGeoPosStatus) => {
    switch (newUserGeoPosStatus) {
      case 'IS_KNOWN':
        if (this._icon?.classList.contains('disabled')) {
          this._icon.classList.remove('disabled');
        }
        break;
      case 'IS_UNKNOWN':
        if (!this._icon?.classList.contains('disabled')) {
          this._icon?.classList.add('disabled');
        }
        break;
      default:
        assertNever(newUserGeoPosStatus);
    }
  };
}

class VesselMarker extends L.Control implements L.Control.VesselMarker {

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
