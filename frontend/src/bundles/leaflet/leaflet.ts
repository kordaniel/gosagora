import L from './initPatchedLeaflet';

import type { LatLngType, MapStateConnection } from './leafletTypes';
import msgBridgeToRN, { type RNLeafletMessage } from './msgBridgeToRN';
import type { GeoPos } from '../../types';
import { GeoPosToPopupHTML } from './helpers';
import { assertNever } from '../../utils/typeguards';
import tileLayers from './tileLayers';


class MapState implements MapStateConnection {
  private readonly _map: L.Map;

  private _currentPosition: LatLngType | null;
  private _userMarker: L.Marker | null;
  private _userMarkerPopup: L.Popup | null;
  private _userCircleMarker: L.Circle | null;
  private _userTrack: L.Polyline | null;

  private _trackCurrentPosition: boolean;
  private _renderUserMarker: boolean;
  private _renderUserCircleMarker: boolean;
  private _renderUserTrack: boolean;

  constructor(map: L.Map) {
    this._map = map;

    this._currentPosition = null;
    this._userMarker = null;
    this._userMarkerPopup = null;
    this._userCircleMarker = null;
    this._userTrack = null;

    this._trackCurrentPosition = false;
    this._renderUserMarker = true;
    this._renderUserCircleMarker = true;
    this._renderUserTrack = true;
  }

  getCurrentGeoPos = () => {
    return this._currentPosition;
  };

  setCurrentPosition = (currentPosition: LatLngType | null) => {
    // TODO: Add state for is tracking and currentPosition === null
    //        - remove userMarker, pause trail
    //        - when currentPostion !== null add userMarker, continue trail
    this._currentPosition = currentPosition;
    if (this._trackCurrentPosition) {
      if (currentPosition) {
        this._map.panTo([currentPosition.lat, currentPosition.lng]);
        this._updateMarkers();
      } else {
        if (this._renderUserCircleMarker && this._userCircleMarker) {
          const newRadius = Math.min(200, 3 * this._userCircleMarker.getRadius());
          this._userCircleMarker.setRadius(newRadius);
        }
      }
    }
  };

  isTrackingCurrentPosition = () => {
    return this._trackCurrentPosition;
  };

  setIsTrackingCurrentPosition = (trackCurrentPosition: boolean) => {
    // TODO: Add waiting for location state
    if (trackCurrentPosition) {
      if (this._currentPosition) {
        this._map.panTo([this._currentPosition.lat, this._currentPosition.lng]);
        this._initializeMarkers();
      } else {
        this._deleteMarkers();
      }
    } else {
      this._deleteMarkers();
    }
    this._trackCurrentPosition = trackCurrentPosition;
  };

  private _initializeMarkers() {
    if (!this._currentPosition) {
      return; // TODO: set error/pending state
    }

    const currentLatLng = new L.LatLng(
      this._currentPosition.lat,
      this._currentPosition.lng
    );

    if (this._renderUserMarker && !this._userMarker) {
      this._userMarker = L.marker(currentLatLng).addTo(this._map);

      console.assert(
        this._userMarkerPopup === null,
        'MapState invalid state (_initializeMarkers): _userMarker === null && _userMarkerPopup !== null'
      );

      this._userMarkerPopup = L.popup({
        content: GeoPosToPopupHTML(this._currentPosition),
      }).openPopup();
      this._userMarker.bindPopup(this._userMarkerPopup);
    }

    if (this._renderUserCircleMarker && !this._userCircleMarker) {
      this._userCircleMarker = L.circle(currentLatLng, {
        radius: this._currentPosition.acc,
      }).addTo(this._map);
    }

    if (this._renderUserTrack && !this._userTrack) {
      this._userTrack = L.polyline([currentLatLng], {
        color: 'blue'
      }).addTo(this._map);
    }
  }

  private _deleteMarkers() {
    if (this._userTrack) {
      this._map.removeLayer(this._userTrack);
      this._userTrack = null;
    }

    if (this._userCircleMarker) {
      this._map.removeLayer(this._userCircleMarker);
      this._userCircleMarker = null;
    }

    if (this._userMarker) {
      this._map.removeLayer(this._userMarker);
      this._userMarker = null;
    }
  }

  private _updateMarkers() {
    if (!this._currentPosition) {
      return;
    }

    const latLngPos = new L.LatLng(
      this._currentPosition.lat,
      this._currentPosition.lng
    );

    // TODO: Delete first check from each if. should always be true if markers are alive
    if (this._renderUserMarker && this._userMarker) {
      this._userMarker.setLatLng(latLngPos);
      console.assert(
        this._userMarkerPopup !== null,
        'MapState invalid state (_updateMarkers): _userMarker !== null && _userMarkerPopup === null'
      );
      this._userMarkerPopup?.setContent(GeoPosToPopupHTML(this._currentPosition));
    }

    if (this._renderUserCircleMarker && this._userCircleMarker) {
      this._userCircleMarker.setLatLng(latLngPos);
      this._userCircleMarker.setRadius(this._currentPosition.acc);
    }

    if (this._renderUserTrack && this._userTrack) {
      if (this._userTrack.getLatLngs().length > 200) {
        this._userTrack.setLatLngs(
          this._userTrack.getLatLngs().slice(20)
        );
      }
      this._userTrack.addLatLng(latLngPos);
    }
  }
}

const handleRNMessage = (msg: RNLeafletMessage) => {
  if (msg.type === 'debug') {
    // NOTE: relay errors back to RN from leaflet msgBridgeToRN setOnMsgHandler's closure try/catch
    msgBridgeToRN.sendMsg(msg);
    return;
  }

  // TODO: Transmit echo debug msg's only in dev env
  msgBridgeToRN.sendMsg({
    type: 'debug',
    payload: {
      echo: JSON.stringify(msg),
    },
  });

  switch (msg.payload.command) {
    case 'setPosition': {
      handleSetPosition(msg.payload.position);
      break;
    }
    default: assertNever(msg.payload.command);
  }
};

document.addEventListener('message', msgBridgeToRN.setOnMsgHandler(handleRNMessage));
window.addEventListener('message', msgBridgeToRN.setOnMsgHandler(handleRNMessage));


const map = L.map('map', {
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'bottomright',
  },
  layers: [tileLayers.openStreetMap, tileLayers.openSeaMap],
}).setView([0.00, 0.00], 10.0);

const mapState = new MapState(map);

L.control.layers(tileLayers.baseOverlays, tileLayers.mapOverlays).addTo(map);
L.control.scale({
  imperial: false,
  metric: true,
  position: 'bottomleft'
}).addTo(map);

L.control.vesselMarker({
  getCurrentGeoPos: mapState.getCurrentGeoPos,
  isTrackingCurrentPosition: mapState.isTrackingCurrentPosition,
  setIsTrackingCurrentPosition: mapState.setIsTrackingCurrentPosition,
}, {
  position: 'bottomright',
}).addTo(map);

map.on('click', (event) => {
  msgBridgeToRN.sendMsg({
    type: 'debug',
    payload: {
      msg: JSON.stringify({
        lat: event.latlng.lat,
        lon: event.latlng.lng
      }),
    },
  });
});

const handleSetPosition = (pos: GeoPos | null) => {
  mapState.setCurrentPosition(!pos ? null : {
    id: pos.id,
    timestamp: pos.timestamp,
    lat: pos.lat,
    lng: pos.lon,
    acc: pos.acc,
    hdg: pos.hdg,
    vel: pos.vel
  });
};
