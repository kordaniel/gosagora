import { useCallback, useEffect, useRef } from 'react';

import type { LocationSubscription } from 'expo-location';

import config from '../utils/config';
import location from '../modules/location';
import { setLocationTrackingStatus } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const dispatch = useAppDispatch();
  const fgWatchPositionSubscriptionRef = useRef<LocationSubscription | null>(null);

  const startTracking = useCallback(async () => {
    const { backgroundPermission, foregroundPermission } = await location.requestPermissions(config.IS_MOBILE);

    if (!foregroundPermission) {
      console.error('no permissions');
      return;
    }
    //if (config.IS_MOBILE && !backgroundPermission) {
    // => show user a notification that she has to grant background (always) permissions
    // => instead of only when in use permissions for the full gosagora features
    //}

    if (config.IS_MOBILE && backgroundPermission) {
      console.log('is mobile, bgPerm/fgPerm:', backgroundPermission, foregroundPermission);
      const isTrackingLocation = await location.startBgLocationUpdates();
      if (!isTrackingLocation) {
        console.error('TODO HANDLE: NOT tracking...');
      }
      dispatch(setLocationTrackingStatus(isTrackingLocation ? 'background' : 'idle'));
    } else {
      console.log('is NOT mobile, bgPerm/fgPerm:', backgroundPermission, foregroundPermission);
      if (fgWatchPositionSubscriptionRef.current !== null) {
        console.log('subscription current was not null......');
        return;
      }
      fgWatchPositionSubscriptionRef.current = config.IS_DEVELOPMENT_ENV && !config.IS_MOBILE // NOTE: use simulated geopos on web in dev env
        ? location.subscribeToSimulatedFgWatchPosition()
        : await location.subscribeToFgWatchPosition();
      dispatch(setLocationTrackingStatus(fgWatchPositionSubscriptionRef.current !== null ? 'foreground' : 'idle'));
    }
  }, [dispatch]);

  const stopTracking = useCallback(() => {
    dispatch(setLocationTrackingStatus('idle'));
    if (config.IS_MOBILE) {
      void location.stopBgLocationUpdates();
    }
    if (fgWatchPositionSubscriptionRef.current !== null) {
      fgWatchPositionSubscriptionRef.current.remove();
      fgWatchPositionSubscriptionRef.current = null;
    }
  }, [dispatch]);

  useEffect(() => {
    void startTracking();
    return stopTracking;
  }, [startTracking, stopTracking]);

  return { startTracking, stopTracking };
};

export default useLocation;
