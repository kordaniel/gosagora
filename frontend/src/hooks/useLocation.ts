import { useCallback, useEffect, useRef } from 'react';

import type { LocationSubscription } from 'expo-location';

import config from '../utils/config';
import location from '../modules/location';
import { setLocationTrackingAndErrorStatus } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const dispatch = useAppDispatch();
  const fgWatchPositionSubscriptionRef = useRef<LocationSubscription | null>(null);

  const stopTracking = useCallback((clearErrors: boolean) => {
    if (clearErrors) {
      dispatch(setLocationTrackingAndErrorStatus({ trackingStatus: 'idle', error: null }));
    } else {
      dispatch(setLocationTrackingAndErrorStatus({ trackingStatus: 'idle' }));
    }

    if (config.IS_MOBILE) {
      void location.stopBgLocationUpdates();
    }
    if (fgWatchPositionSubscriptionRef.current !== null) {
      fgWatchPositionSubscriptionRef.current.remove();
      fgWatchPositionSubscriptionRef.current = null;
    }
  }, [dispatch]);

  const startTracking = useCallback(async () => {
    const errorMessages: string[] = [];
    const { backgroundPermission, foregroundPermission } = await location.requestPermissions(config.IS_MOBILE);

    if (!foregroundPermission) {
      dispatch(setLocationTrackingAndErrorStatus({
        trackingStatus: 'idle',
        error: 'GosaGora Navigation needs to access your location. Please enable location permissions in system settings',
      }));
      return;
    }
    if (config.IS_MOBILE && !backgroundPermission) {
      errorMessages.push([
        'GosaGora Navigation needs background access to your location for continuous tracking.',
        'Please enable background location permissions in system settings. Without it, many features won\'t work properly'
      ].join(' '));
    }

    if (config.IS_MOBILE && backgroundPermission) {
      const isTrackingLocation = await location.startBgLocationUpdates();
      if (!isTrackingLocation) {
        errorMessages.push([
          'We weren\'t able to access your location for Navigation.',
          'This might be due to battery saver mode, system restrictions or app settings.',
          'Please check your settings and restart GosaGora if the issue continues, and contact our support team if the problem persists'
        ].join(' '));
      }
      dispatch(setLocationTrackingAndErrorStatus({
        trackingStatus: isTrackingLocation ? 'background' : 'idle',
        error: errorMessages.length === 0 ? null : errorMessages.join('\n'),
      }));
    } else {
      if (fgWatchPositionSubscriptionRef.current !== null) {
        stopTracking(false);
      }

      // NOTE: use simulated geopos on web in dev env
      const useSimulatedLocation = config.IS_DEVELOPMENT_ENV && !config.IS_MOBILE;
      fgWatchPositionSubscriptionRef.current = useSimulatedLocation
        ? location.subscribeToSimulatedFgWatchPosition()
        : await location.subscribeToFgWatchPosition();

      dispatch(setLocationTrackingAndErrorStatus({
        trackingStatus: useSimulatedLocation ? 'foreground-simulated' : 'foreground',
        error: errorMessages.length === 0 ? null : errorMessages.join('\n'),
      }));
    }
  }, [dispatch, stopTracking]);

  useEffect(() => {
    void startTracking();
    return () => stopTracking(true);
  }, [startTracking, stopTracking]);

  return { startTracking, stopTracking };
};

export default useLocation;
