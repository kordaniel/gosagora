import L from 'leaflet';

import type { WebViewMessageEvent } from 'react-native-webview';

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (data: string) => void;
    };
  }

  interface DocumentEventMap {
    message: MessageEvent;
  }
}

const messageToRN = (data: string) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(data);
  } else if (window.parent) {
    window.parent.postMessage(data, '*');
  }
};

const onMessage = (
  event: MessageEvent<string> | WebViewMessageEvent['nativeEvent'] // iframe contentWindow.postMessage | react-native-webview postMessage event
) => {
  messageToRN(JSON.stringify({ type: 'debug', raw: event.data }));

  const data = JSON.parse(event.data) as {
    command: string;
    lat: number;
    lon: number;
    zoom?: number;
    accuracy?: number
  };
  if (data.command === 'setView') {
    setLocation(data);
  }
};

document.addEventListener('message', onMessage); // android!
window.addEventListener('message', onMessage);   // web!, ios?


const tileLayerOptions: L.TileLayerOptions = {
  maxZoom: 19,
  minZoom: 1,
};

const map = L.map('map').setView([0.00, 0.00], 10.0);
let userMarker: L.Marker | null = null;
let userCircleMarker: L.Circle | null = null;
let userTrack: L.Polyline | null = null;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  ...tileLayerOptions,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
  ...tileLayerOptions,
  attribution: '&copy; <a href="https://www.openseamap.org">OpenSeaMap</a>',
}).addTo(map);


map.on('click', (event) => {
  const message = JSON.stringify({
    lat: event.latlng.lat,
    lon: event.latlng.lng,
  });
  messageToRN(message);
});

const setLocation = (loc: {
  lat: number,
  lon: number,
  zoom?: number,
  accuracy?: number
}) => {
  if (loc.zoom) {
    map.setView([loc.lat, loc.lon], loc.zoom);
  } else {
    map.panTo([loc.lat, loc.lon]);
  }

  if (loc.accuracy) {
    if (userMarker) {
      userMarker.setLatLng([loc.lat, loc.lon]);
    } else {
      userMarker = L.marker([loc.lat, loc.lon]).addTo(map);
    }

    if (userCircleMarker) {
      userCircleMarker.setLatLng([loc.lat, loc.lon]);
      userCircleMarker.setRadius(loc.accuracy);
    } else {
      userCircleMarker = L.circle([loc.lat, loc.lon], { radius: loc.accuracy }).addTo(map);
    }

    if (userTrack) {
      const latLngs = userTrack.getLatLngs();
      if (latLngs.length > 200) {
        userTrack.setLatLngs(latLngs.slice(20));
      }
      userTrack.addLatLng([loc.lat, loc.lon]);
    } else {
      userTrack = L.polyline([[loc.lat, loc.lon]], { color: 'blue' }).addTo(map);
    }
  } else {
    if (userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
    if (userCircleMarker) {
      map.removeLayer(userCircleMarker);
      userCircleMarker = null;
    }
  }
};
