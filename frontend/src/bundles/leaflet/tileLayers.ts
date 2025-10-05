import AutoGraticule from 'leaflet-auto-graticule';
import L from 'leaflet';
import { decimalCoordToDMSString } from '../../utils/stringTools';

// NOTE: If PR https://github.com/FacilMap/Leaflet.AutoGraticule/pull/3 gets merged:
//        - Update leaflet-auto-graticule package
//        - Delete this override and set the format of graticule labels in AutoGraticule constructor
//        - Delete the override of autoGraticule.lineStyle = { .. } of the AutoGraticule instance
AutoGraticule.prototype.buildLabel = function(axis: 'gridlabel-horiz' | 'gridlabel-vert', val: number): L.Marker {
  const bounds = this._map.getBounds().pad(-0.003);
  let latLng: L.LatLng;
  let dms: string;
  if (axis === 'gridlabel-horiz') {
    latLng = new L.LatLng(bounds.getNorth(), val);
    dms = decimalCoordToDMSString('horizontal', val);
  } else {
    latLng = new L.LatLng(val, bounds.getWest());
    dms = decimalCoordToDMSString('vertical', val);
  }

  return L.marker(latLng, {
    interactive: false,
    icon: L.divIcon({
      iconSize: [0, 0],
      className: 'leaflet-grid-label',
      html: '<div class="' + axis + '">' + dms + '</div>',
    }),
  });
};

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

const autoGraticule = new AutoGraticule(
  //{ NOTE: Use these options if https://github.com/FacilMap/Leaflet.AutoGraticule/pull/3 gets merged
  //  labelFormat: 'dms',
  //  labelSize: 'large',
  //  lineStyle: {
  //    color: '#000',
  //    dashArray: '0 10 0',
  //    interactive: false,
  //    opacity: 0.15,
  //    weight: 2,
  //  }
  //}
);

autoGraticule.lineStyle = {
  // NOTE: Delete this override if PR https://github.com/FacilMap/Leaflet.AutoGraticule/pull/3 gets merged
  color: '#000',
  dashArray: '0 10 0',
  interactive: false,
  opacity: 0.15,
  stroke: true,
  weight: 2,
};

const baseOverlays: Record<string, L.TileLayer> = {
  'OpenStreetMap': openStreetMap,
  'OpenTopoMap (Limited coverage)': openTopoMap,
};

const mapOverlays: Record<string, L.TileLayer | L.LayerGroup> = {
  'OpenSeaMap': openSeaMap,
  'Graticule:': autoGraticule,
};

export default {
  openStreetMap,
  openSeaMap,
  baseOverlays,
  mapOverlays,
};
