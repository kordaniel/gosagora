import L, { GosaGoraMap } from './initPatchedLeaflet';

import msgBridgeToRN, { type RNToLeafletMessage } from './msgBridgeToRN';
import { assertNever } from '../../utils/typeguards';
import { geoPosToLatLngType } from './helpers';
import tileLayers from './tileLayers';


const SEND_DEBUG_ECHO_MESSAGES = false;

const handleRNMessage = (msg: RNToLeafletMessage) => {
  if (msg.type === 'debug') {
    // NOTE: relay errors back to RN from leaflet msgBridgeToRN setOnMsgHandler's closure try/catch
    msgBridgeToRN.sendMsg(msg);
    return;
  }

  if (SEND_DEBUG_ECHO_MESSAGES) {
    msgBridgeToRN.sendMsg({
      type: 'debug',
      payload: {
        echo: JSON.stringify(msg),
      },
    });
  }

  switch (msg.payload.command) {
    case 'setPosition': {
      map.setCurrentPosition(geoPosToLatLngType(msg.payload.position));
      break;
    }
    case 'setPositions': {
      map.setPositions(msg.payload.positions.map(geoPosToLatLngType));
      break;
    }
    default: assertNever(msg.payload);
  }
};

document.addEventListener('click', (event: MouseEvent) => {
  const target = event.target;
  if (!target || !(target instanceof HTMLElement)) {
    return;
  }
  const anchor = target.closest('a');
  if (!anchor || !anchor.href) {
    return;
  }
  if (anchor.classList.contains('leaflet-popup-close-button')) {
    return;
  }

  event.preventDefault();

  msgBridgeToRN.sendMsg({
    type: 'command',
    payload: {
      command: 'openUrl',
      href: anchor.href,
    },
  });
});

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

const vesselMarkerCircle = L.circle([0, 0], {
  color: '#3388FF',
  fill: true,
  fillOpacity: 0.15,
  interactive: false,
  radius: 500,
  stroke: false,
  weight: 1, // stroke width
}).addTo(map);

L.marker.vesselMarker([0, 0], vesselMarkerCircle).addTo(map);
