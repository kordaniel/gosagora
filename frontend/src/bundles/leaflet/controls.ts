import L from 'leaflet';

import type {
  LatLngType,
  MapStateConnection,
  UserGeoPosStatus,
} from './leafletTypes';
import {
  headingToString,
  velocityToString,
} from '../../utils/stringTools';
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

class OnScreenDisplay extends L.Control implements L.Control.OnScreenDisplay {

  private _map?: L.Map;
  private _getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'];
  private _overlay?: L.Control;
  private _overlayPosition: Required<L.ControlOptions['position']>;
  private _heading!: HTMLTableCellElement | null;
  private _velocity!: HTMLTableCellElement | null;

  constructor(
    getCurrentGeoPos: MapStateConnection['getCurrentGeoPos'],
    options?: L.Control.OnScreenDisplayOptions
  ) {
    const { overlayPosition, ...controlOptions } = options ?? {};
    super({ position: 'bottomright', ...controlOptions });
    this._overlayPosition = overlayPosition ?? 'topleft';
    this._getCurrentGeoPos = getCurrentGeoPos;
  }

  override onAdd(map: L.Map): HTMLElement {
    this._map = map;
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
    L.DomUtil.create('span', 'leaflet-control-onscreen-display', link);
    link.href = '#';

    L.DomEvent.on(link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      this._onClick();
    }, this);

    this._overlay = new L.Control({
      position: this._overlayPosition,
    });

    this._overlay.onAdd = (_map: L.Map) => {
      const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-onscreen-display-overlay');
      container.innerHTML = `
        <table>
          <tbody>
            <tr><td class="double" id="heading">-°</td></tr>
            <tr><td class="double" id="velocity">- kts</td></tr>
          </tbody>
        </table>`;
      this._heading = container.querySelector<HTMLTableCellElement>('#heading');
      this._velocity = container.querySelector<HTMLTableCellElement>('#velocity');

      return container;
    };

    return container;
  }

  onNewUserGeoPos = (newCurrenPosition: LatLngType | null) => {
    if (this._heading) {
      this._heading.innerHTML = headingToString(newCurrenPosition?.hdg, 0);
    }
    if (this._velocity) {
      this._velocity.innerHTML = velocityToString(newCurrenPosition?.vel);
    }
  };

  private _onClick() {
    if (this._map && this._overlay) {
      if ('_map' in this._overlay && this._overlay._map === this._map) {
        this._map.removeControl(this._overlay);
      } else {
        this._map.addControl(this._overlay);
        this.onNewUserGeoPos(this._getCurrentGeoPos());
      }
    }
  }
}

class VesselMarker extends L.Control implements L.Control.VesselMarker {

  private _map?: L.Map;
  private _container?: HTMLDivElement;
  private _link?: HTMLAnchorElement;
  private _icon?: HTMLSpanElement;
  private _vesselMarkerState: 'disabled' | 'waiting' | 'enabled' | 'following';

  private _mapStateConnection: MapStateConnection;

  constructor(mapStateConnection: MapStateConnection, options?: L.ControlOptions) {
    super(options);
    this._mapStateConnection = mapStateConnection;
    this._vesselMarkerState = 'disabled';
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

    this._map.on('dragstart', () => {
      if (this._vesselMarkerState === 'following') {
        this._mapStateConnection.setIsTrackingCurrentPosition(false);
        this._setEnabled();
      }
    });

    return this._container;
  }

  private _onClick() {
    switch (this._vesselMarkerState) {
      case 'disabled': {
        const currentPosition = this._mapStateConnection.getCurrentGeoPos();
        if (currentPosition) {
          this._setFollowing();
        } else {
          this._setWaiting();
        }
        break;
      }
      case 'waiting':
        this._setDisabled();
        break;
      case 'enabled':
        this._setFollowing();
        break;
      case 'following':
        this._setDisabled();
        break;
      default:
        assertNever(this._vesselMarkerState);
    }
  }

  private _setDisabled() {
    this._vesselMarkerState = 'disabled';
    this._mapStateConnection.setIsTrackingCurrentPosition(false);
    if (this._icon) {
      this._icon.setAttribute('class', 'leaflet-control-boating-arrow');
    }
  }

  private _setWaiting() {
    this._vesselMarkerState = 'waiting';
    if (this._icon) {
      this._icon.setAttribute('class', 'leaflet-control-boating-arrow requesting');
    }
  }

  private _setEnabled() {
    this._vesselMarkerState = 'enabled';
    if (this._icon) {
      this._icon.setAttribute('class', 'leaflet-control-boating-arrow locating');
    }
  }

  private _setFollowing() {
    this._vesselMarkerState = 'following';
    this._mapStateConnection.setIsTrackingCurrentPosition(true);
    if (this._icon) {
      console.log('icon:', this._icon.classList);
      this._icon.setAttribute('class', 'leaflet-control-boating-arrow following');
    }
  }
}

export default {
  CenterMapToLocation,
  OnScreenDisplay,
  VesselMarker,
};
