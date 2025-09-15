import { useEffect } from 'react';

import type { LocationSubscription } from 'expo-location';

import config from '../utils/config';
import location from '../modules/location';
import { setLocationStatus } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let fgWatchPositionSubscription: LocationSubscription | null = null;

    const startTracking = async () => {
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
        fgWatchPositionSubscription = await location.subscribeToFgWatchPosition();
        dispatch(setLocationStatus(fgWatchPositionSubscription !== null ? 'foreground' : 'idle'));
      }
    };

    const stopTracking = () => {
      dispatch(setLocationStatus('idle'));
      if (config.IS_MOBILE) {
        void location.stopBgLocationUpdates();
      }
      if (fgWatchPositionSubscription !== null) {
        fgWatchPositionSubscription.remove();
      }
    };

    void startTracking();

    return stopTracking;
  }, [dispatch]);
};

export default useLocation;
