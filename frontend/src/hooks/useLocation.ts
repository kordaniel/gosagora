import { useEffect, useState } from 'react';

import * as Location from 'expo-location';

import { addLocation } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const requestPermissions = async (): Promise<boolean> => {
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();
      if (foregroundPermission.status !== Location.PermissionStatus.GRANTED) {
        console.error('Permission to access foreground location was denied');
        return false;
      }
      const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
      if (backgroundPermission.status !== Location.PermissionStatus.GRANTED) {
        console.error('Permission to access background location was denied');
        return false;
      }

      console.log('Permission to access location was granted!');
      return true;
    };

    const subscribeToWatchPosition = async () => {
      subscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 3,
      }, (loc) => {
        dispatch(addLocation({
          timestamp: loc.timestamp,
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          acc: loc.coords.accuracy,
          hdg: loc.coords.heading,
          vel: loc.coords.speed,
        }));
      });

      setIsInitialized(subscription !== null);
    };

    requestPermissions()
      .then((permissionsGranted) => {
        if (permissionsGranted) {
          void subscribeToWatchPosition();
        } else {
          console.log('no permissions to watch position');
        }
      })
      .catch(err => {
        console.error('ERROR, permissions denied:', err);
      });

    return () => {
      console.log('attempt unsubscribe');
      if (subscription) {
        console.log('UNSUBSCRIBED');
        subscription.remove();
      } else {
        console.log('NOT UNSUBSCRIBED');
      }
      setIsInitialized(false);
    };

  }, [dispatch]);

  return { isInitialized };
};

export default useLocation;
