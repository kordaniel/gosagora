import L from 'leaflet';

const tileLayerOptions: L.TileLayerOptions = {
  maxZoom: 19,
  minZoom: 1,
};

const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  ...tileLayerOptions,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  ...tileLayerOptions,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org/about">OpenTopoMap (CC-BY-SA)</a>',
});

const openSeaMap = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
  ...tileLayerOptions,
  attribution: '&copy; <a href="https://www.openseamap.org">OpenSeaMap</a>',
});

const baseOverlays: Record<string, L.TileLayer> = {
  'OpenStreetMap': openStreetMap,
  'OpenTopoMap (Limited coverage)': openTopoMap,
};

const mapOverlays: Record<string, L.TileLayer> = {
  'OpenSeaMap': openSeaMap,
};

export default {
  openStreetMap,
  openSeaMap,
  baseOverlays,
  mapOverlays,
};
