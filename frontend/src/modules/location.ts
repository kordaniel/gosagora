import * as Location from 'expo-location';

import taskManager, { BG_TASK } from '../background/taskManager';
import type { GeoPos } from '../types';

export interface LocationTaskExecutorBody {
  locations: Location.LocationObject[];
}

export const locObjToGeoPos = (pos: Location.LocationObject | null): GeoPos | null => {
  return pos === null
    ? null
    : {
        timestamp: pos.timestamp,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        acc: pos.coords.accuracy,
        hdg: pos.coords.heading,
        vel: pos.coords.speed,
      };
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

const startTracking = async (): Promise<boolean> => {
  const isLocationUpdatesTaskDefined = await Location.hasStartedLocationUpdatesAsync(BG_TASK.Location);
  console.log('isLocationUpdatesTaskDefined:', isLocationUpdatesTaskDefined);
  if (isLocationUpdatesTaskDefined) {
    return isLocationUpdatesTaskDefined;
  }

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

  const success = await Location.hasStartedLocationUpdatesAsync(BG_TASK.Location);
  console.log('isLocationUpdatesTaskDefined success:', success);
  return success;
};

const stopTracking = async (): Promise<void> => {
  const isLocationTaskRegistered = await taskManager.isTaskRegistered(BG_TASK.Location);
  if (isLocationTaskRegistered) {
    // TODO: Do we need this check?
    await Location.stopLocationUpdatesAsync(BG_TASK.Location);
  }
};

export default {
  requestPermissions,
  startTracking,
  stopTracking,
};
