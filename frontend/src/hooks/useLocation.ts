import { useCallback, useEffect, useRef } from 'react';

import type { LocationSubscription } from 'expo-location';

import location, {
  subscribeToSimulatedFgWatchPosition
} from '../modules/location';
import config from '../utils/config';
import { setLocationStatus } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const dispatch = useAppDispatch();
  const fgWatchPositionSubscriptionRef = useRef<LocationSubscription | null>(null);

  const startTracking = useCallback(async () => {
    const permissionsGranted = await location.requestPermissions(config.IS_MOBILE);
    if (!permissionsGranted) {
      console.error('TODO HANDLE: No permissions to track location');
      return;
    }

    if (config.IS_MOBILE) {
      console.log('is mobile');
      const isTrackingLocation = await location.startBgLocationUpdates();
      if (!isTrackingLocation) {
        console.error('TODO HANDLE: NOT tracking...');
      }
      dispatch(setLocationStatus(isTrackingLocation ? 'background' : 'idle'));
    } else {
      console.log('is NOT mobile');
      if (fgWatchPositionSubscriptionRef.current !== null) {
        console.log('subscription current was not null......');
        return;
      }
      fgWatchPositionSubscriptionRef.current = config.IS_DEVELOPMENT_ENV
        ? subscribeToSimulatedFgWatchPosition()
        : await location.subscribeToFgWatchPosition();
      dispatch(setLocationStatus(fgWatchPositionSubscriptionRef.current !== null ? 'foreground' : 'idle'));
    }
  }, [dispatch]);

  const stopTracking = useCallback(() => {
    dispatch(setLocationStatus('idle'));
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
