import * as Location from 'expo-location';

import taskManager, {
  BG_TASK,
  type LocationTaskExecutorType
} from '../backgroundTasks/taskManager';
import type { GeoPos } from '../types';
import { addLocation } from '../store/slices/locationSlice';
import config from '../utils/config';
import { generateIdFromTimestamp } from '../utils/idGenerator';
import store from '../store';

export interface LocationTaskExecutorBody {
  locations: Location.LocationObject[];
}

const locationAccuracyOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 1000,  // emit at least every second
  distanceInterval: 2, // or when moved 2 meters
};

const locObjToGeoPos = (pos: Location.LocationObject | null): GeoPos | null => {
  return pos === null ? null : {
    id: generateIdFromTimestamp(pos.timestamp),
    timestamp: pos.timestamp,
    lat: pos.coords.latitude,
    lon: pos.coords.longitude,
    acc: pos.coords.accuracy,
    hdg: pos.coords.heading,
    vel: pos.coords.speed,
  };
};

export const bgLocationTaskExecutor: LocationTaskExecutorType<LocationTaskExecutorBody> = async ({ data, error }) => {
  if (error) {
    console.error('bgLocationTaskExecutor executor error:', error);
  } else if (data) {
    console.log('bgLocationTaskExecutor executor data:', data);
    data.locations.forEach(loc => {
      store.dispatch(addLocation(locObjToGeoPos(loc)));
    });
  }

  return Promise.resolve();
};

const fgWatchPositionCb: Location.LocationCallback = (loc) => {
  store.dispatch(addLocation(locObjToGeoPos(loc)));
};

const requestPermissions = async (includeBgPermissions: boolean = true): Promise<boolean> => {
  const foregroundPermission = await Location.requestForegroundPermissionsAsync();
  if (foregroundPermission.status !== Location.PermissionStatus.GRANTED) {
    console.error('Permission to access foreground location was denied');
    return false;
  }
  if (includeBgPermissions) {
    const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
    if (backgroundPermission.status !== Location.PermissionStatus.GRANTED) {
      console.error('Permission to access background location was denied');
      return false;
    }
  }

  console.log('Permission to access location was granted!');
  return true;
};

const startBgLocationUpdates = async (): Promise<boolean> => {
  if (!config.IS_MOBILE) {
    return false;
  }

  const isLocationUpdatesTaskDefined = await Location.hasStartedLocationUpdatesAsync(BG_TASK.Location);
  console.log('isLocationUpdatesTaskDefined:', isLocationUpdatesTaskDefined);
  if (isLocationUpdatesTaskDefined) {
    return isLocationUpdatesTaskDefined;
  }

  await Location.startLocationUpdatesAsync(BG_TASK.Location, {
    ...locationAccuracyOptions,
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

const stopBgLocationUpdates = async (): Promise<void> => {
  const isLocationTaskRegistered = await taskManager.isTaskRegistered(BG_TASK.Location);
  if (isLocationTaskRegistered) {
    // TODO: Do we need this check?
    await Location.stopLocationUpdatesAsync(BG_TASK.Location);
  }
};

const subscribeToFgWatchPosition = async (): Promise<Location.LocationSubscription> => {
  return await Location.watchPositionAsync(
    locationAccuracyOptions,
    fgWatchPositionCb,
    (errorReason: string) => {
      console.error('Location.watchPositionAsync:', errorReason);
    }
  );
};

export default {
  requestPermissions,
  startBgLocationUpdates,
  stopBgLocationUpdates,
  subscribeToFgWatchPosition,
};
