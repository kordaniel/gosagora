import L from 'leaflet';

import {
  DistanceUnits,
  VelocityUnits,
} from '../../utils/unitConverter';
import {
  dateOrTimestampToString,
  decimalCoordToDMSString,
  distanceToString,
  headingToString,
  velocityToString,
} from '../../utils/stringTools';
import type { LatLngType } from './leafletTypes';
import { clampNumber } from '../../utils/helpers';

class VesselMarker extends L.Marker implements L.Marker.VesselMarker {

  private _iconSvg?: SVGElement | null;
  private _circle: L.Circle;
  private _popup: L.Popup;
  private _popupFields: {
    hdg: HTMLElement | null;
    vel: HTMLElement | null;
    timestamp: HTMLElement | null;
    acc: HTMLElement | null;
    lat: HTMLElement | null;
    lng: HTMLElement | null;
  };

  constructor(
    latlng: L.LatLngExpression,
    circle: L.Circle,
    options?: L.Marker.VesselMarkerOptions) {
    const { vesselColor, ...markerOptions } = options ?? {};
    if (!('icon' in markerOptions)) {
      markerOptions.icon = L.divIcon({
        className: 'boat',
        html: `
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" id="boat-svg">
            <path d="M 128 512 C 128 512 128 128 256 0 C 384 128 384 512 384 512 Z" fill="${vesselColor ?? '#3388FF'}"/>
          </svg>`,
        iconAnchor: [12.5, 12.5],
        iconSize: [25, 25],
      });
    }
    super(latlng, markerOptions);

    this._circle = circle;

    this._popupFields = {
      hdg: null, vel: null, timestamp: null, acc: null, lat: null, lng: null
    };

    const createPopupContent = (): HTMLElement => {
      const container = L.DomUtil.create('div', 'leaflet-marker-vessel-popup');
      const heading = L.DomUtil.create('h4', '', container);
      const content = L.DomUtil.create('div', 'leaflet-marker-vessel-popup-grid', container);

      const div1 = L.DomUtil.create('div', '', content);
      const span1 = L.DomUtil.create('span', '', div1);
      this._popupFields.hdg = L.DomUtil.create('strong', 'leaflet-marker-vessel-big', div1);

      const div2 = L.DomUtil.create('div', '', content);
      const span2 = L.DomUtil.create('span', '', div2);
      this._popupFields.vel = L.DomUtil.create('strong', 'leaflet-marker-vessel-big', div2);

      const div3 = L.DomUtil.create('div', '', content);
      const span3 = L.DomUtil.create('span', '', div3);
      this._popupFields.timestamp = L.DomUtil.create('strong', '', div3);

      const div4 = L.DomUtil.create('div', '', content);
      const span4 = L.DomUtil.create('span', '', div4);
      this._popupFields.lat = L.DomUtil.create('strong', '', div4);

      const div5 = L.DomUtil.create('div', '', content);
      const span5 = L.DomUtil.create('span', '', div5);
      this._popupFields.lng = L.DomUtil.create('strong', '', div5);

      const div6 = L.DomUtil.create('div', '', content);
      const span6 = L.DomUtil.create('span', '', div6);
      this._popupFields.acc = L.DomUtil.create('strong', '', div6);

      heading.innerHTML = 'Position Data';

      span1.innerHTML = 'COG: ';
      this._popupFields.hdg.innerHTML = headingToString(null, 2);

      span2.innerHTML = 'SOG: ';
      this._popupFields.vel.innerHTML = velocityToString(null, VelocityUnits.KilometersPerHour, 2);

      span3.innerHTML = 'Time: ';
      this._popupFields.timestamp.innerHTML = dateOrTimestampToString(null, { date: false, time: true });

      span4.innerHTML = 'Latitude: ';
      this._popupFields.lat.innerHTML = decimalCoordToDMSString('horizontal', null);

      span5.innerHTML = 'Longitude: ';
      this._popupFields.lng.innerHTML = decimalCoordToDMSString('vertical', null);

      span6.innerHTML = 'Accuracy: ';
      this._popupFields.acc.innerHTML = distanceToString(null, DistanceUnits.Meters, 2);

      return container;
    };

    this._popup = L.popup({
      content: createPopupContent(),
    });
    this.bindPopup(this._popup);

    this.on('add', () => {
      this._iconSvg = this.getElement()?.querySelector<SVGElement>('#boat-svg');
    });

    this.on('currentPosition:update', (event) => {
      if (event.currentPosition !== null) {
        const latLng = new L.LatLng(event.currentPosition.lat, event.currentPosition.lng);
        this._circle.setLatLng(latLng);
        this._circle.setRadius(event.currentPosition.acc);
        this._circle.setStyle({
          dashArray: undefined,
          fillColor: undefined,
        });
        this.setLatLng(latLng);
        this._updateIcon(event.currentPosition.hdg ?? 0);
      } else {
        this._circle.setRadius(clampNumber(this._circle.getRadius() + 150, 100, 1000));
        this._circle.setStyle({
          dashArray: '5',
          fillColor: '#FF3388',
        });
      }

      if (this._popup.isOpen()) {
        this._updatePopup(event.currentPosition);
      }
    });
  }

  private _updateIcon(heading: number) {
    if (this._iconSvg) {
      this._iconSvg.style.transform = `rotate(${heading}deg)`;
    }
  }

  private _updatePopup(currentPosition: LatLngType | null) {
    if (this._popupFields.hdg) {
      this._popupFields.hdg.innerHTML = headingToString(currentPosition?.hdg, 2);
    }
    if (this._popupFields.vel) {
      this._popupFields.vel.innerHTML = velocityToString(currentPosition?.vel, VelocityUnits.KilometersPerHour, 2);
    }
    if (this._popupFields.timestamp) {
      this._popupFields.timestamp.innerHTML = dateOrTimestampToString(currentPosition?.timestamp, { date: false });
    }
    if (this._popupFields.lat) {
      this._popupFields.lat.innerHTML = decimalCoordToDMSString('horizontal', currentPosition?.lat);
    }
    if (this._popupFields.lng) {
      this._popupFields.lng.innerHTML = decimalCoordToDMSString('vertical', currentPosition?.lng);
    }
    if (this._popupFields.acc) {
      this._popupFields.acc.innerHTML = distanceToString(currentPosition?.acc, DistanceUnits.Meters, 2);
    }
    this._popup.update();
  }
}

export default {
  VesselMarker,
};
