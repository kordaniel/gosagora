import L from 'leaflet';

import type {
  ChangedUserGeoPosStatusCallback,
  GeoPosUpdateEvent,
  LatLngType,
  MapStateConnection,
  UserGeoPosStatus,
} from './leafletTypes';
import { GeoPosToPopupHTML } from './helpers';

export class GosaGoraMap extends L.Map implements MapStateConnection {

  private _userGeoPosStatus: UserGeoPosStatus;
  private _userGeoPosStatusChangeCallbacks: Set<ChangedUserGeoPosStatusCallback>;

  private _currentPosition: LatLngType | null;
  private _userMarker: L.Marker | null;
  private _userMarkerPopup: L.Popup | null;
  private _userCircleMarker: L.Circle | null;
  private _userTrack: L.Polyline | null;

  private _trackCurrentPosition: boolean;
  private _renderUserMarker: boolean;
  private _renderUserCircleMarker: boolean;
  private _renderUserTrack: boolean;

  constructor(element: string | HTMLElement, options?: L.MapOptions) {
    super(element, options);

    this._userGeoPosStatus = 'IS_UNKNOWN';
    this._userGeoPosStatusChangeCallbacks = new Set<ChangedUserGeoPosStatusCallback>();

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

  subscribeUserGeoPosStatusChangeCallback = (cb: ChangedUserGeoPosStatusCallback) => {
    this._userGeoPosStatusChangeCallbacks.add(cb);
    cb(this._userGeoPosStatus);
  };

  getCurrentGeoPos = () => {
    return this._currentPosition;
  };

  setCurrentPosition = (newCurrentPosition: LatLngType | null) => {
    if (this._currentPosition === null && newCurrentPosition === null) {
      return;
    }

    const event: GeoPosUpdateEvent = {
      type: 'mapState:userGeoPosChange',
      payload: {
        currentPosition: newCurrentPosition,
        userGeoPosStatus: newCurrentPosition ? 'IS_KNOWN' : 'IS_UNKNOWN',
      },
    };
    this.fire(event.type, event.payload);

    console.log('setPos');
    const updateUserGeoPosStatus =
      !(this._currentPosition !== null && newCurrentPosition !== null);
    console.log('updateUserGeoPosStatus:', updateUserGeoPosStatus);
    this._currentPosition = newCurrentPosition;
    if (updateUserGeoPosStatus) {
      this._userGeoPosStatus = newCurrentPosition ? 'IS_KNOWN' : 'IS_UNKNOWN';
      this._emitUserGeoPosStatusChange();
    }

    if (this._trackCurrentPosition) {
      if (newCurrentPosition) {
        this.panTo([newCurrentPosition.lat, newCurrentPosition.lng]);
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
        this.panTo([this._currentPosition.lat, this._currentPosition.lng]);
        this._initializeMarkers();
      } else {
        this._deleteMarkers();
      }
    } else {
      this._deleteMarkers();
    }
    this._trackCurrentPosition = trackCurrentPosition;
  };

  private _emitUserGeoPosStatusChange() {
    this._userGeoPosStatusChangeCallbacks.forEach(cb => cb(this._userGeoPosStatus));
  }

  private _initializeMarkers() {
    if (!this._currentPosition) {
      return; // TODO: set error/pending state
    }

    const currentLatLng = new L.LatLng(
      this._currentPosition.lat,
      this._currentPosition.lng
    );

    if (this._renderUserMarker && !this._userMarker) {
      this._userMarker = L.marker(currentLatLng).addTo(this);

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
      }).addTo(this);
    }

    if (this._renderUserTrack && !this._userTrack) {
      this._userTrack = L.polyline([currentLatLng], {
        color: 'blue'
      }).addTo(this);
    }
  }

  private _deleteMarkers() {
    if (this._userTrack) {
      this.removeLayer(this._userTrack);
      this._userTrack = null;
    }

    if (this._userCircleMarker) {
      this.removeLayer(this._userCircleMarker);
      this._userCircleMarker = null;
    }

    if (this._userMarker) {
      this.removeLayer(this._userMarker);
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

