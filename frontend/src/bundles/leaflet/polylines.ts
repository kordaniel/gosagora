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

  constructor(
    latlngs?: L.LatLngExpression[][],
    options?: L.PolylineOptions
  ) {
    const multiPolyline: L.LatLngExpression[][] = !latlngs || latlngs.length === 0
      ? [[]]
      : [
          latlngs[0], // NOTE: Let current ring have length <= 1
          ...latlngs.slice(1).filter(ll => ll.length > 1) // NOTE: Filter rings that are empty or consists of one point
        ];

    super(multiPolyline, {
      color: '#FF3388',
      opacity: 0.75,
      ...options
    });

    this._addNewRing = false;

    this.on('currentPosition:update', (event) => {
      if (event.currentPosition === null) {
        this._addNewRing = true; // Start a new polyline
        return;
      }

      if (!this._addNewRing) {
        this.addLatLng([
          event.currentPosition.lat,
          event.currentPosition.lng
        ]);
        return;
      }

      // Start new polyline after currentPosition has been null

      const polylines = this.getLatLngs() as L.LatLng[][];
      this.setLatLngs([
        [
          [event.currentPosition.lat, event.currentPosition.lng]
        ],
        ...polylines
      ]);
      this._addNewRing = false;
    });
  }
}

export default {
  VesselTrail,
};
