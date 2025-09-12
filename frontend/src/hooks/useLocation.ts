import { useEffect, useState } from 'react';

import * as Location from 'expo-location'; // TODO: Remove from this module

import taskManager, {
  BG_TASK,
  type LocationTaskExecutorType,
} from '../background/taskManager';
import type { GeoPos } from '../types';
import { addLocation } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

interface LocationTaskBody {
  locations: Location.LocationObject[];
}

const toGeoPos = (loc: Location.LocationObject | null): GeoPos | null => {
  // TODO: Move
  return loc === null ? null : {
    timestamp: loc.timestamp,
    lat: loc.coords.latitude,
    lon: loc.coords.longitude,
    acc: loc.coords.accuracy,
    hdg: loc.coords.heading,
    vel: loc.coords.speed,
  };
};

const useLocation = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBgTaskLocation: LocationTaskExecutorType<LocationTaskBody> = async ({ data, error }) => {
      if (error) {
        console.error('handleBgTaskLocation executor error:', error);
      } else if (data) {
        console.log('handleBgTaskLocation executor data:', data);
        data.locations.forEach(loc => {
          dispatch(addLocation(toGeoPos(loc)));
        });
      }

      return Promise.resolve();
    };

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

    const startLocationTracking = async () => {
      const isLocationUpdatesTaskDefined = await Location.hasStartedLocationUpdatesAsync(BG_TASK.Location);
      console.log('islocation:', isLocationUpdatesTaskDefined);
      if (!isLocationUpdatesTaskDefined) {
        await Location.startLocationUpdatesAsync(BG_TASK.Location, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,  // emit at least every second
          distanceInterval: 2, // or when moved 2 meters
          pausesUpdatesAutomatically: false,           // ios only? if true, behaviour depends on activityType
          activityType: Location.ActivityType.Fitness, // ios only?
          showsBackgroundLocationIndicator: true,
          foregroundService: { // android requires for background location
            notificationTitle: 'Location tracking',
            notificationBody: 'Tracking your location in the background',
          }
        });
      }
      const isNow = await Location.hasStartedLocationUpdatesAsync(BG_TASK.Location);
      console.log('isNow:', isNow);
      setIsTracking(isNow);
    };

    const stopLocationTracking = () => {
      setIsTracking(false);
      taskManager.isTaskRegistered(BG_TASK.Location)
        .then(async (isTracking) => {
          if (isTracking) {
            await Location.stopLocationUpdatesAsync(BG_TASK.Location);
          }
        })
        .catch(err => console.error('stopLocationTracking error:', err));
    };

    if (!taskManager.isTaskDefined(BG_TASK.Location)) {
      taskManager.defineTask<LocationTaskBody>(BG_TASK.Location , handleBgTaskLocation);
    }

    requestPermissions()
      .then((permissionsGranted) => {
        if (permissionsGranted) {
          void startLocationTracking();
        } else {
          console.log('no permissions to watch position');
        }
      })
      .catch(err => {
        console.error('ERROR, permissions denied:', err);
      });

    return stopLocationTracking;
  }, [dispatch]);

  return { isInitialized: isTracking };
};

export default useLocation;
