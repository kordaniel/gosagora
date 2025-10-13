import L from 'leaflet';

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
class VesselTrail extends L.Polyline {

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
      opacity: 0.75,
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
  VesselTrail,
};
