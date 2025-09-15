import { useEffect, useState } from 'react';

import type { LocationSubscription } from 'expo-location';

import config from '../utils/config';
import location from '../modules/location';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
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
        setIsTracking(isTrackingLocation);
      } else {
        console.log('is NOT mobile');
        fgWatchPositionSubscription = await location.subscribeToFgWatchPosition();
        setIsTracking(fgWatchPositionSubscription !== null);
      }
    };

    const stopTracking = () => {
      setIsTracking(false);
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

  return { isInitialized: isTracking };
};

export default useLocation;
