import L from 'leaflet';

import type {
  LatLngType,
  UserGeoPosStatus,
} from './leafletTypes';
import {
  headingToString,
  velocityToString,
} from '../../utils/stringTools';
import { assertNever } from '../../utils/typeguards';

class GroupedControls extends L.Control implements L.Control.GroupedControls {

  private _container?: HTMLDivElement;

  constructor(options: L.ControlOptions) {
    super({ position: 'bottomright', ...options });
  }

  override onAdd(_map: L.GosaGoraMap): HTMLElement {
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control grouped-controls');

    L.DomEvent.disableClickPropagation(this._container);
    L.DomEvent.disableScrollPropagation(this._container);

    return this._container;
  }

  appendControlElement = (control: HTMLElement): HTMLElement | undefined => {
    if (this._container) {
      this._container.appendChild(control);
    }
    return this._container;
  };
}


class CenterMapToLocation extends L.Control implements L.Control.CenterMaptoLocation {

  private _map?: L.GosaGoraMap;
  private _container?: HTMLElement;
  private _icon?: HTMLSpanElement;

  constructor(options?: L.ControlOptions) {
    super(options);
  }

  override onAdd(map: L.GosaGoraMap): HTMLElement {
    this._map = map;
    const link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single');
    this._icon = L.DomUtil.create('span', 'leaflet-control-center-map-to disabled', link);
    link.href = '#';

    L.DomEvent.on(link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      const currentGeoPos = this._map?.getCurrentGeoPos();
      if (this._map && currentGeoPos) {
        this._map.setView(
          [currentGeoPos.lat, currentGeoPos.lng],
          Math.max(this._map.getZoom(), 12)
        );
      }
    });

    const groupedControlsContainer = this._map.appendControlElementToGroupedControls(link);
    if (groupedControlsContainer) {
      this._container = groupedControlsContainer;
    } else {
      this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      this._container.appendChild(link);
    }

    return this._container;
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

  private _map?: L.GosaGoraMap;

  private _container?: HTMLElement;
  private _overlay?: L.Control;
  private _overlayPosition: Required<L.ControlOptions['position']>;
  private _heading!: HTMLTableCellElement | null;
  private _velocity!: HTMLTableCellElement | null;

  constructor(options?: L.Control.OnScreenDisplayOptions) {
    const { overlayPosition, ...controlOptions } = options ?? {};
    super({ position: 'bottomright', ...controlOptions });
    this._overlayPosition = overlayPosition ?? 'topleft';
  }

  override onAdd(map: L.GosaGoraMap): HTMLElement {
    this._map = map;
    const link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single');
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

    const groupedControlsContainer = this._map.appendControlElementToGroupedControls(link);
    if (groupedControlsContainer) {
      this._container = groupedControlsContainer;
    } else {
      this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      this._container.appendChild(link);
    }

    return this._container;
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
        this.onNewUserGeoPos(this._map.getCurrentGeoPos());
      }
    }
  }
}

class VesselMarker extends L.Control implements L.Control.VesselMarker {

  private _map?: L.GosaGoraMap;
  private _container?: HTMLElement;
  private _link?: HTMLAnchorElement;
  private _icon?: HTMLSpanElement;
  private _vesselMarkerState: 'disabled' | 'waiting' | 'enabled' | 'following';

  constructor(options?: L.ControlOptions) {
    super({ position: 'bottomright', ...options });
    this._vesselMarkerState = 'disabled';
  }

  override onAdd(map: L.GosaGoraMap): HTMLElement {
    this._map = map;
    this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single');
    this._icon = L.DomUtil.create('span', 'leaflet-control-boating-arrow', this._link);
    this._link.href = '#';

    L.DomEvent.on(this._link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      this._onClick();
    }, this);

    this._map.on('dragstart', () => {
      if (this._vesselMarkerState === 'following') {
        this._map?.setIsTrackingCurrentPosition(false);
        this._setEnabled();
      }
    });

    const groupedControlsContainer = this._map.appendControlElementToGroupedControls(this._link);
    if (groupedControlsContainer) {
      this._container = groupedControlsContainer;
    } else {
      this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      this._container.appendChild(this._link);
    }

    return this._container;
  }

  waitForCurrentPosition = (newCurrentPosition: LatLngType | null) => {
    if (newCurrentPosition) {
      this._map?.unsubscribeCurrentPositionChangeCallback(this.waitForCurrentPosition);
      this._setFollowing();
    }
  };

  private _onClick() {
    switch (this._vesselMarkerState) {
      case 'disabled': {
        const currentPosition = this._map?.getCurrentGeoPos();
        if (currentPosition) {
          this._setFollowing();
        } else {
          this._setWaiting();
        }
        break;
      }
      case 'waiting':
        this._map?.unsubscribeCurrentPositionChangeCallback(this.waitForCurrentPosition);
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
    this._map?.setIsTrackingCurrentPosition(false);
    this._map?.setIsVesselMarkerTrailEnabled(false);
    if (this._icon) {
      this._icon.setAttribute('class', 'leaflet-control-boating-arrow');
    }
  }

  private _setWaiting() {
    this._vesselMarkerState = 'waiting';
    this._map?.subscribeCurrentPositionChangeCallback(this.waitForCurrentPosition);
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
    this._map?.setIsTrackingCurrentPosition(true);
    this._map?.setIsVesselMarkerTrailEnabled(true);
    if (this._map && this._map.getZoom() < 12) {
      this._map.setZoom(12);
    }
    if (this._icon) {
      this._icon.setAttribute('class', 'leaflet-control-boating-arrow following');
    }
  }
}

class VesselTrailControl extends L.Control implements L.Control.VesselTrailControl {

  private _map?: L.GosaGoraMap;
  private _container?: HTMLElement;
  private _icon?: HTMLSpanElement;

  constructor(options?: L.ControlOptions) {
    super(options);
  }

  override onAdd(map: L.GosaGoraMap): HTMLElement {
    this._map = map;
    const link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single');
    this._icon = L.DomUtil.create(
      'span',
      map.isVesselMarkerTrailEnabled()
        ? 'leaflet-control-vessel-trail on'
        : 'leaflet-control-vessel-trail',
      link
    );
    link.href = '#';

    L.DomEvent.on(link, 'click', (e: Event) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      if (!this._map) {
        console.warn('VesselTrailControl has no map connection');
        return;
      }
      this._map.setIsVesselMarkerTrailEnabled(
        !this._map.isVesselMarkerTrailEnabled()
      );
      this.updateIcon();
    }, this);

    const groupedControlsContainer = this._map.appendControlElementToGroupedControls(link);
    if (groupedControlsContainer) {
      this._container = groupedControlsContainer;
    } else {
      this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      this._container.appendChild(link);
    }

    return this._container;
  }

  updateIcon = () => {
    if (this._map && this._map.isVesselMarkerTrailEnabled()) {
      this._icon?.setAttribute('class', 'leaflet-control-vessel-trail on');
    } else if (this._icon) {
      this._icon.setAttribute('class', 'leaflet-control-vessel-trail');
    }
  };
}

export default {
  CenterMapToLocation,
  GroupedControls,
  OnScreenDisplay,
  VesselMarker,
  VesselTrailControl,
};
