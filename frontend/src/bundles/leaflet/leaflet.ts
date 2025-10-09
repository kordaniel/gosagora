import L, { GosaGoraMap } from './initPatchedLeaflet';

import msgBridgeToRN, { type RNLeafletMessage } from './msgBridgeToRN';
import type { GeoPos } from '../../types';
import type { GeoPosUpdateEvent } from './leafletTypes';
import { assertNever } from '../../utils/typeguards';
import tileLayers from './tileLayers';

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

const map = new GosaGoraMap('map', {
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'bottomright',
  },
  layers: [tileLayers.openStreetMap, tileLayers.openSeaMap],
}).setView([0.00, 0.00], 10.0);

L.control.layers(tileLayers.baseOverlays, tileLayers.mapOverlays).addTo(map);
L.control.scale({
  imperial: false,
  metric: true,
  position: 'bottomleft'
}).addTo(map);

const centerMapToLocation = L.control.centerMapToLocation(map.getCurrentGeoPos, {
  position: 'bottomright',
}).addTo(map);

map.subscribeUserGeoPosStatusChangeCallback(centerMapToLocation.onUserGeoPosStatusChange);

L.control.vesselMarker({
  getCurrentGeoPos: map.getCurrentGeoPos,
  isTrackingCurrentPosition: map.isTrackingCurrentPosition,
  setIsTrackingCurrentPosition: map.setIsTrackingCurrentPosition,
}, {
  position: 'bottomright',
}).addTo(map);

const vesselMarker = L.marker.vesselMarker([0, 0]).addTo(map);
//vesselMarker.rotate();

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

map.on('mapState:userGeoPosChange', (e: GeoPosUpdateEvent['payload'] ) => {
  console.log('map RECV:', e);
});


const handleSetPosition = (pos: GeoPos | null) => {
  map.setCurrentPosition(!pos ? null : {
    id: pos.id,
    timestamp: pos.timestamp,
    lat: pos.lat,
    lng: pos.lon,
    acc: pos.acc,
    hdg: pos.hdg,
    vel: pos.vel
  });
};
