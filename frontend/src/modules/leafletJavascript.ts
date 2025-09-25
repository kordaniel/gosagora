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

export default {
  getLeafletStylesheetLinkAttribs,
  getDocumentStyleSheet,
};
