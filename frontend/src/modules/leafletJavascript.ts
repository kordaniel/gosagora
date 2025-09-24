const LEAFLET_VERSION = '1.9.4';

const getLeafletStylesheetLinkAttribs = () => ({
  rel: 'stylesheet',
  href: `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`,
  integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
  crossorigin: '',
});

const getDocumentStyleSheet = () => `
      #map {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    `;

const getLeafletScriptAttribs = () => ({
  src: `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`,
  integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
  crossorigin: '',
});

const getRNCommunicator = () => `
      const messageToRN = (msg) => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(msg);
        } else if (window.parent) {
          window.parent.postMessage(msg, '*');
        }
      };
    `;

const getLeafletMap = (
  initialPos: { lat: number, lon: number, zoom?: number } = { lat: 0, lon: 0, zoom: 10.0 }
) => `
      const map = L.map('map').setView([${initialPos.lat}, ${initialPos.lon}], ${initialPos.zoom ?? 10.0});
      let userCircleMarker = null;
      let userMarker = null;
      let userTrack = null;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 1,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openseamap.org">OpenSeaMap</a>',
        maxZoom: 19,
        minZoom: 1,
      }).addTo(map);

      map.on('click', (e) => {
        const message = JSON.stringify({ lat: e.latlng.lat, lon: e.latlng.lng });
        messageToRN(message);
      });

      const onMessage = (e) => {
        messageToRN(JSON.stringify({ type: 'debug', raw: e.data }));

        const data = JSON.parse(e.data);
        if (data.command === 'setView') {
          setLocation(data);
        }
      };

      const setLocation = (loc) => {
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
      }
    `;

const getAddEventListeners = () => `
      document.addEventListener('message', onMessage); // android
      window.addEventListener('message', onMessage);   // ios (?, not tested), web
    `;

export default {
  getLeafletStylesheetLinkAttribs,
  getDocumentStyleSheet,
  getLeafletScriptAttribs,
  getRNCommunicator,
  getLeafletMap,
  getAddEventListeners,
};
