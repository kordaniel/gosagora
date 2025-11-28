import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import type { LocationSubscription } from 'expo-location';

import config from '../utils/config';
import geoPosManager from '../modules/location/geoPosManager';
import location from '../modules/location';

const useLocation = (autostartTracking: boolean = true) => {
  const fgWatchPositionSubscriptionRef = useRef<LocationSubscription | null>(null);
  const locationTrackingStatus = useSyncExternalStore(geoPosManager.subscribe, geoPosManager.getLocationTrackingStatus);
  const currentPosition = useSyncExternalStore(geoPosManager.subscribeToCurrentPosition, geoPosManager.getCurrentPosition);
  const isTrackingTrail = useSyncExternalStore(geoPosManager.subscribe, geoPosManager.isTrackingTrail);

  const stopTrackingAllowed = !isTrackingTrail;

  const initializeTrackingRef = useRef<() => void>(() => {
    if (autostartTracking && locationTrackingStatus.state === 'idle') {
      void startTracking();
      return () => stopTracking(true);
    }
    return () => {};
  });

  useEffect(() => {
    return initializeTrackingRef.current(); // NOTE: Callback defined in the useRef() call => always defined
  }, []);

  const stopTracking = useCallback((clearErrors: boolean) => {
    if (!stopTrackingAllowed) {
      return;
    }
    if (clearErrors) {
      geoPosManager.setLocationTrackingStatus({ error: null, state: 'idle' });
    } else {
      geoPosManager.setLocationTrackingState('idle');
    }

    if (config.IS_MOBILE) {
      void location.stopBgLocationUpdates();
    }
    if (fgWatchPositionSubscriptionRef.current !== null) {
      fgWatchPositionSubscriptionRef.current.remove();
      fgWatchPositionSubscriptionRef.current = null;
    }
  }, [stopTrackingAllowed]);

  const startTracking = useCallback(async () => {
    const errorMessages: string[] = [];
    const { backgroundPermission, foregroundPermission } = await location.requestPermissions(config.IS_MOBILE);

    if (!foregroundPermission) {
      geoPosManager.setLocationTrackingStatus({
        state: 'idle',
        error: 'GosaGora Navigation needs to access your location. Please enable location permissions in system settings',
      });
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
      geoPosManager.setLocationTrackingStatus({
        error: errorMessages.length === 0 ? null : errorMessages.join('\n'),
        state: isTrackingLocation ? 'background' : 'idle',
      });
    } else {
      if (fgWatchPositionSubscriptionRef.current !== null) {
        stopTracking(false);
      }

      // NOTE: use simulated geopos on web in dev env
      const useSimulatedLocation = config.IS_DEVELOPMENT_ENV && !config.IS_MOBILE;
      fgWatchPositionSubscriptionRef.current = useSimulatedLocation
        ? location.subscribeToSimulatedFgWatchPosition()
        : await location.subscribeToFgWatchPosition();

      geoPosManager.setLocationTrackingStatus({
        error: errorMessages.length === 0 ? null : errorMessages.join('\n'),
        state: useSimulatedLocation ? 'foreground-simulated' : 'foreground',
      });
    }
  }, [stopTracking]);

  return {
    currentPosition,
    locationTrackingStatus,
    startTracking,
    stopTracking,
    stopTrackingAllowed,
  };
};

export default useLocation;
