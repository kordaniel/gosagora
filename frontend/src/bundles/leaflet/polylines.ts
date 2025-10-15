import L from 'leaflet';
import { computeDestinationPoint } from 'geolib';

import type { LatLngType } from './leafletTypes';

class VelocityVector implements L.VelocityVector {

  static readonly RenderPane = 'velocityVectorPane';

  private _vectorSegmentsCount: number;  // Amount of segments to divide the vector into
  private _vectorLengthMinutes: number;  // How far ahead the total of the segments project into the future
  private _segmentLengthMinutes: number; // How far ahead one segment project into the future
  private _vector: L.Polyline[];

  private _overlay: L.Control;

  constructor(options?: L.VelocityVectorOptions) {
    this._vectorSegmentsCount = options?.segmentsCount || 4;
    this._vectorLengthMinutes = options?.lengthMinutes || 60;
    this._segmentLengthMinutes = (this._vectorLengthMinutes / this._vectorSegmentsCount);

    const segmentColors = {
      first: options?.segmentColors?.first || '#FF84B7',
      second: options?.segmentColors?.second || '#84FFCC',
    };

    this._vector = this._computeVectorPoints(null).map((coords, i) => {
      return L.polyline(coords, {
        color: i % 2 === 0 ? segmentColors.first : segmentColors.second,
        opacity: 0.9,
        pane: VelocityVector.RenderPane,
        weight: 2,
      });
    });

    this._overlay = new L.Control({
      position: options?.overlayPosition ?? 'bottomleft',
    });

    this._overlay.onAdd = (_map: L.Map) => {
      const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control-onscreen-display-overlay');
      container.innerHTML =
`<div class="velocity-vector-grid">
   <div class="gridcell" style="background-color: ${segmentColors.first}"></div>
   <div class="gridcell" style="background-color: ${segmentColors.second}"></div>
   <div class="gridcell text">${Math.round(this._segmentLengthMinutes)}min</div>
   <div class="gridcell text">${Math.round(2 * this._segmentLengthMinutes)}min</div>
 </div>`;

      return container;
    };
  }

  addTo(map: L.GosaGoraMap) {
    this._vector.forEach(v => v.addTo(map));
    this._overlay.addTo(map);
  }

  onNewUserGeoPos(newCurrenPosition: LatLngType | null) {
    this._computeVectorPoints(newCurrenPosition).forEach((coords, i) => {
      this._vector[i].setLatLngs(coords);
    });
  }

  private _computeVectorPoints(position: LatLngType | null): Array<[[number, number], [number, number]]> {
    if (!position || position.hdg === null || position.vel === null) {
      return Array.from({ length: this._vectorSegmentsCount }, () => [[0, 0], [0, 0]]);
    }

    const segmentDistance = this._segmentLengthMinutes * 60 * position.vel;
    const heading = position.hdg;
    const coords = [
      { latitude: position.lat, longitude: position.lng },
      { latitude: position.lat, longitude: position.lng }
    ];

    return Array.from({ length: this._vectorSegmentsCount }, (_, i) => {
      coords[(i+1) % 2] = computeDestinationPoint(coords[i%2], segmentDistance, heading);
      return [
        [coords[i%2].latitude, coords[i%2].longitude],
        [coords[(i+1) % 2].latitude, coords[(i+1) % 2].longitude],
      ];
    });
  }
}

/**
 * Class that renders the trail of a vessels path. If current geopos is lost (null), starts a separate new
 * trail (new ring) when the position is known again, and does not render a connection between these trails.
 *
 * Implemented on top of Leaflet Polyline, which is defined to work with one-dimensional as well as with
 * multi-dimensional polylines. In contrast to this, this class supports ONLY multi-dimensional polylines,
 * meaning that all latlngs inside this class must have the form:
 *  L.LatLng[][] <==> [
 *   [ [lat, lng], [lat, lng], ..],
 *   ..
 *  ]
 * where each subarray contains points of one separate polyline.
 *
 * Please note that this implementation is not strongly typed to assert that this holds, but
 * uses 'as' casting where needed to silence compiler warnings.
 */
class VesselTrail extends L.Polyline implements L.VesselTrail {

  private _addNewRing: boolean;
  private _currentPointsTotalCnt: number;
  private _maxPointsCnt: number;
  private _trimPointsCnt;

  constructor(
    latlngs?: L.LatLngExpression[][],
    options?: L.PolylineOptions
  ) {
    const multiPolyline: L.LatLngExpression[][] = !latlngs || latlngs.length === 0
      ? [[]]
      : [
          latlngs[0], // First (current) ring can have length <= 1
          ...latlngs.slice(1).filter(ll => ll.length > 1) // Filter rings that are empty or consists of one point
        ];

    super(multiPolyline, {
      color: '#FF3388',
      opacity: 0.9,
      weight: 2,
      ...options
    });

    this._addNewRing = false;
    this._currentPointsTotalCnt = multiPolyline.reduce((sum, curPolyline) => {
      return sum + curPolyline.length;
    }, 0);
    this._maxPointsCnt = 30000;
    this._trimPointsCnt = Math.round(0.1 * this._maxPointsCnt);

    this.on('currentPosition:update', (event) => {
      if (event.currentPosition === null) {
        this._addNewRing = true; // Start a new polyline
        return;
      }

      this._trimLength();

      if (!this._addNewRing) {
        this.addLatLng([
          event.currentPosition.lat,
          event.currentPosition.lng
        ]);
      } else {
        // Start new polyline after currentPosition has been null
        const polylines = this.getLatLngs() as L.LatLng[][];
        this.setLatLngs([
          [
            [event.currentPosition.lat, event.currentPosition.lng]
          ],
          ...polylines
        ]);
        this._addNewRing = false;
      }

      this._currentPointsTotalCnt += 1;
    });
  }

  private _trimLength() {
    if (this._currentPointsTotalCnt < this._maxPointsCnt) {
      return;
    }

    const multiPolyline = this.getLatLngs() as L.LatLng[][];

    let pointsCnt = 0;
    for (let i = 0; i < multiPolyline.length; i++) {
      if (pointsCnt + multiPolyline[i].length < this._maxPointsCnt) {
        pointsCnt += multiPolyline[i].length;
        continue;
      }

      multiPolyline[i] = multiPolyline[i].slice(
        this._trimPointsCnt  + (pointsCnt - this._maxPointsCnt)
      );
      pointsCnt += multiPolyline[i].length;
      this._currentPointsTotalCnt = pointsCnt;
      this.setLatLngs(multiPolyline.slice(
        0,
        i > 0 && multiPolyline[i].length > 1 ? i+1 : i
      ));
    }
  }
}

export default {
  VelocityVector,
  VesselTrail,
};
