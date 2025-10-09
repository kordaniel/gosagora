import L from 'leaflet';

class VesselMarker extends L.Marker implements L.Marker.VesselMarker {

  private _iconSvg?: SVGElement | null;

  constructor(latlng: L.LatLngExpression, options?: L.MarkerOptions) {
    if (options && 'icon' in options) {
      super(latlng, options);
    } else {
      super(latlng, {
        icon: L.divIcon({
          className: 'boat',
          html: `
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" id="boat-svg">
              <path d="M 128 512 C 128 512 128 128 256 0 C 384 128 384 512 384 512 Z" fill="#1010FF"/>
            </svg>`,
          iconAnchor: [12.5, 12.5],
          iconSize: [25, 25],
        }),
        ...options
      });
    }

    this.on('add', () => {
      this._iconSvg = this.getElement()?.querySelector<SVGElement>('#boat-svg');
    });

    this.on('currentPosition:update', (event) => {
      if (event.currentPosition === null) {
        console.log('VesselMarker recv null');
        return;
      } // TODO: Handle else
      this.setLatLng([event.currentPosition.lat, event.currentPosition.lng]);
      this._updateIcon(event.currentPosition.hdg ?? 0);
    });
  }

  private _updateIcon(heading: number) {
    if (this._iconSvg) {
      this._iconSvg.style.transform = `rotate(${heading}deg)`;
    }
  }
}

export default {
  VesselMarker,
};
