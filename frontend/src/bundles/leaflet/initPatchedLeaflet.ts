import 'leaflet.fullscreen';
import L from 'leaflet';

import type {
  ChangedUserGeoPosStatusCallback,
  CurrentPositionChangeCallback,
  LatLngType,
  UserGeoPosStatus,
} from './leafletTypes';
import controls from './controls';
import markers from './markers';
import polylines from './polylines';

// Fix marker default icon (not bundled by esbuild), encode png's in base64.
// NOTE: that even though iconUrl icon is included in bundled CSS, leaflet still loads it separately.
L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
  iconRetinaUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABSCAMAAAAhFXfZAAAC91BMVEVMaXEzeak2f7I4g7g3g7cua5gzeKg8hJo3grY4g7c3grU0gLI2frE0daAubJc2gbQwd6QzeKk2gLMtd5sxdKIua5g1frA2f7IydaM0e6w2fq41fK01eqo3grgubJgta5cxdKI1f7AydaQydaMxc6EubJgvbJkwcZ4ubZkwcJwubZgubJcydqUydKIxapgubJctbJcubZcubJcvbJYubJcvbZkubJctbJctbZcubJg2f7AubJcrbZcubJcubJcua5g3grY0fq8ubJcubJdEkdEwhsw6i88vhswuhcsuhMtBjMgthMsrg8srgss6is8qgcs8i9A9iMYtg8spgcoogMo7hcMngMonf8olfso4gr8kfck5iM8jfMk4iM8he8k1fro7itAgesk2hs8eecgzfLcofssdeMg0hc4cd8g2hcsxeLQbdsgZdcgxeLImfcszhM0vda4xgckzhM4xg84wf8Yxgs4udKsvfcQucqhUndROmdM1fK0wcZ8vb5w0eqpQm9MzeKhXoNVcpdYydKNWn9VZotVKltJFjsIwcJ1Rms9OlslLmtH///8+kc9epdYzd6dbo9VHkMM2f7FHmNBClM8ydqVcpNY9hro3gLM9hLczealQmcw3fa46f7A8gLMxc6I3eagyc6FIldJMl9JSnNRSntNNl9JPnNJFi75UnM9ZodVKksg8kM45jc09e6ZHltFBk883gbRBh7pDk9EwcaBzn784g7dKkcY2i81Om9M7j85Llc81is09g7Q4grY/j9A0eqxKmdFFltBEjcXf6fFImdBCiLxJl9FGlNFBi78yiMxVndEvbpo6js74+vx+psPP3+o/ks5HkcpGmNCjwdZCkNDM3ehYoNJEls+lxNkxh8xHks0+jdC1zd5Lg6r+/v/H2ufz9/o3jM3t8/edvdM/k89Th61OiLBSjbZklbaTt9BfptdjmL1AicBHj8hGk9FAgK1dkLNTjLRekrdClc/k7fM0icy0y9tgp9c4jc2NtM9Dlc8zicxeXZn3AAAAQ3RSTlMAHDdTb4yPA+LtnEQmC4L2EmHqB7XA0d0sr478x4/Yd5i1zOfyPkf1sLVq4Nh3FvjxopQ2/STNuFzUwFIwxKaejILpIBEV9wAABhVJREFUeF6s1NdyFEcY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',
  shadowUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC',
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:    [41, 41]
});

L.Control.CenterMaptoLocation = controls.CenterMapToLocation;
L.control.centerMapToLocation = function(options) {
  return new L.Control.CenterMaptoLocation(options);
};

L.Control.GroupedControls = controls.GroupedControls;
L.control.groupedControls = function(options) {
  return new L.Control.GroupedControls(options);
};

L.Control.OnScreenDisplay = controls.OnScreenDisplay;
L.control.onScreenDisplay = function(options) {
  return new L.Control.OnScreenDisplay(options);
};

L.Control.VesselMarker = controls.VesselMarker;
L.control.vesselMarker = function(options) {
  return new L.Control.VesselMarker(options);
};

L.Control.VesselTrailControl = controls.VesselTrailControl;
L.control.vesselTrailControl = function(options) {
  return new L.Control.VesselTrailControl(options);
};

L.Marker.VesselMarker = markers.VesselMarker;
L.marker.vesselMarker = function(latlng, circle, options?) {
  return new L.Marker.VesselMarker(latlng, circle, options);
};

L.VelocityVector = polylines.VelocityVector;
L.velocityVector = function(options?: L.VelocityVectorOptions) {
  return new L.VelocityVector(options);
};

L.VesselTrail = polylines.VesselTrail;
L.vesselTrail = function(latlngs?, options?) {
  return new L.VesselTrail(latlngs, options);
};

export class GosaGoraMap extends L.Map implements L.GosaGoraMap {

  private _markers: Set<L.Marker>;     // Send currentPosition:update event for every position (even null)

  private _userGeoPosStatus: UserGeoPosStatus;
  private _userGeoPosStatusChangeCallbacks: Set<ChangedUserGeoPosStatusCallback>;
  private _currentPositionChangeCallbacks: Set<CurrentPositionChangeCallback>;

  private _currentPosition: LatLngType | null;
  private _isTrackingCurrentPosition: boolean;

  private _groupedControls?: L.Control.GroupedControls;
  private _centerMapToLocation: L.Control.CenterMaptoLocation;
  private _onScreenDisplay: L.Control.OnScreenDisplay;
  private _vesselTrail: L.VesselTrail;
  private _vesselTrailControl: L.Control.VesselTrailControl;
  private _vesselMarkerControl: L.Control.VesselMarker;
  private _velocityVector: L.VelocityVector;

  constructor(
    element: string | HTMLElement,
    options?: L.GosaGoraMapOptions
  ) {
    const {
      centerMapToLocation,
      onScreenDisplay,
      vesselTrail,
      vesselTrailControl,
      vesselMarkerControl,
      ...mapOptions
    } = options ?? {};
    super(element, mapOptions);

    this.createPane(L.VelocityVector.RenderPane).style.zIndex = '650';

    this._markers = new Set<L.Marker>();

    this._userGeoPosStatus = 'IS_UNKNOWN';
    this._userGeoPosStatusChangeCallbacks = new Set<ChangedUserGeoPosStatusCallback>();
    this._currentPositionChangeCallbacks = new Set<CurrentPositionChangeCallback>();

    this._currentPosition = null;
    this._isTrackingCurrentPosition = false;

    this._centerMapToLocation = centerMapToLocation ?? L.control.centerMapToLocation({
      position: 'bottomright'
    });
    this.subscribeUserGeoPosStatusChangeCallback(this._centerMapToLocation.onUserGeoPosStatusChange);

    this._onScreenDisplay = onScreenDisplay ?? L.control.onScreenDisplay({
      position: 'bottomright',
      overlayPosition: 'topleft',
    });
    this.subscribeCurrentPositionChangeCallback(this._onScreenDisplay.onNewUserGeoPos);

    this._vesselTrail = vesselTrail ?? L.vesselTrail();
    this._vesselTrailControl = vesselTrailControl ?? L.control.vesselTrailControl({
      position: 'bottomright'
    });
    this._vesselMarkerControl = vesselMarkerControl ?? L.control.vesselMarker();

    this._groupedControls = L.control.groupedControls({
      position: 'bottomright'
    });
    this._groupedControls.addTo(this);

    this._vesselMarkerControl.addTo(this);
    this._vesselTrailControl.addTo(this);
    this._onScreenDisplay.addTo(this);
    this._centerMapToLocation.addTo(this);

    this._velocityVector = L.velocityVector({
      overlayPosition: 'bottomleft'
    });
    this._velocityVector.addTo(this);

    this.on('layeradd', (e) => {
      if (e.layer instanceof L.Marker) {
        this._markers.add(e.layer);
      }
    });

    this.on('layerremove', (e) => {
      if (e.layer instanceof L.Marker) {
        this._markers.delete(e.layer);
      }
    });
  }

  appendControlElementToGroupedControls = (control: HTMLElement): HTMLElement | undefined => {
    return this._groupedControls
      ? this._groupedControls.appendControlElement(control)
      : undefined;
  };

  subscribeUserGeoPosStatusChangeCallback = (cb: ChangedUserGeoPosStatusCallback) => {
    this._userGeoPosStatusChangeCallbacks.add(cb);
    cb(this._userGeoPosStatus);
  };

  subscribeCurrentPositionChangeCallback = (cb: CurrentPositionChangeCallback) => {
    this._currentPositionChangeCallbacks.add(cb);
    cb(this._currentPosition);
  };

  unsubscribeCurrentPositionChangeCallback = (cb: CurrentPositionChangeCallback) => {
    this._currentPositionChangeCallbacks.delete(cb);
  };

  getCurrentGeoPos = () => {
    return this._currentPosition;
  };

  setCurrentPosition = (newCurrentPosition: LatLngType | null) => {
    // Always emit, even if newCurrentPosition === null, let accuracy circle grow
    this._markers.forEach(m => {
      m.fire<'currentPosition:update'>('currentPosition:update', {
        currentPosition: newCurrentPosition,
      });
    });

    // Dont continue if prev and new currentPosition === null
    if (this._currentPosition === null && newCurrentPosition === null) {
      return;
    }

    const updateUserGeoPosStatus =
      !(this._currentPosition !== null && newCurrentPosition !== null);

    this._currentPosition = newCurrentPosition;

    this._vesselTrail.fire<'currentPosition:update'>('currentPosition:update', {
      currentPosition: newCurrentPosition,
    });

    this._emitCurrentPositionChange();

    if (updateUserGeoPosStatus) {
      this._userGeoPosStatus = newCurrentPosition ? 'IS_KNOWN' : 'IS_UNKNOWN';
      this._emitUserGeoPosStatusChange();
    }

    if (this._isTrackingCurrentPosition && newCurrentPosition) {
      this.panTo([newCurrentPosition.lat, newCurrentPosition.lng]);
    }
  };

  isTrackingCurrentPosition = () => {
    return this._isTrackingCurrentPosition;
  };

  setIsTrackingCurrentPosition = (trackCurrentPosition: boolean) => {
    this._isTrackingCurrentPosition = trackCurrentPosition;
    if (trackCurrentPosition && this._currentPosition) {
      this.panTo([this._currentPosition.lat, this._currentPosition.lng]);
    }
  };

  setIsVesselMarkerTrailEnabled = (enableVesselMarkerTrail: boolean) => {
    if (enableVesselMarkerTrail && !this.isVesselMarkerTrailEnabled()) {
      this._vesselTrail.addTo(this);
    } else if (!enableVesselMarkerTrail && this.isVesselMarkerTrailEnabled()) {
      this._vesselTrail.removeFrom(this);
    }
    this._vesselTrailControl.updateIcon();
  };

  isVesselMarkerTrailEnabled = (): boolean => {
    return this.hasLayer(this._vesselTrail);
  };

  private _emitUserGeoPosStatusChange() {
    this._userGeoPosStatusChangeCallbacks.forEach(cb => cb(this._userGeoPosStatus));
  }

  private _emitCurrentPositionChange() {
    this._currentPositionChangeCallbacks.forEach(cb => cb(this._currentPosition));
    this._velocityVector.onNewUserGeoPos(this._currentPosition);
  }
}

export default L;
