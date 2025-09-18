import * as Location from 'expo-location';

import { randRange, randUnitRangeFrom } from '../../utils/helpers';
import taskManager, {
  BG_TASK,
  type LocationTaskExecutorType
} from '../../backgroundTasks/taskManager';
import config from '../../utils/config';
import { handleNewLocation } from '../../store/slices/locationSlice';
import { locObjToGeoPos } from './helpers';
import store from '../../store';
import unitConverter from '../../utils/unitConverter';

export interface LocationTaskExecutorBody {
  locations: Location.LocationObject[];
}

const locationAccuracyOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 1000,  // emit at least every second
  distanceInterval: 2, // or when moved 2 meters
};

export const bgLocationTaskExecutor: LocationTaskExecutorType<LocationTaskExecutorBody> = async ({ data, error }) => {
  if (error) {
    console.error('bgLocationTaskExecutor executor error:', error);
  } else if (data) {
    console.log('bgLocationTaskExecutor executor data, locations.length =', data.locations.length);
    data.locations.forEach(loc => {
      store.dispatch(handleNewLocation(locObjToGeoPos(loc)));
    });
  }

  return Promise.resolve();
};

const fgWatchPositionCb: Location.LocationCallback = (loc) => {
  store.dispatch(handleNewLocation(locObjToGeoPos(loc)));
};

const requestPermissions = async (includeBgPermissions: boolean = true): Promise<{
  backgroundPermission: boolean;
  foregroundPermission: boolean;
}> => {
  const fgPermsGranted = (await Location.getForegroundPermissionsAsync()).granted;
  const bgPermsGranted = includeBgPermissions
    ? (await Location.getBackgroundPermissionsAsync()).granted
    : false;

  if (fgPermsGranted && (!includeBgPermissions || bgPermsGranted)) {
    return {
      backgroundPermission: bgPermsGranted,
      foregroundPermission: true
    };
  }

  const foregroundPermission = (await Location.requestForegroundPermissionsAsync()).granted;
  const backgroundPermission = includeBgPermissions
    ? (await Location.requestBackgroundPermissionsAsync()).granted
    : false;

  return { backgroundPermission, foregroundPermission };
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
    deferredUpdatesDistance: 0,
    deferredUpdatesInterval: 5000,
    pausesUpdatesAutomatically: false,           // ios only
    activityType: Location.ActivityType.Fitness, // ios only
    showsBackgroundLocationIndicator: true,      // ios only
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

const subscribeToSimulatedFgWatchPosition = (): Location.LocationSubscription => {
  const EARTH_RADIUS = 6371009; // meters
  const FREQ = 3;               // update frequency, seconds
  const COURSE_MIN_STEPS = 30;  // minimum amount of updates before possible direction change

  let latitude = 65.00;
  let longitude = 25.00;
  let course = Math.random() * 360;
  let courseSteps = 0;       // amount of updates since last (larger) change of direction
  const courseDeltaMax = 10; // max change of direction in a normal update
  let acc = 55.0;
  let vel = randRange(2.0, 10.0);
  let velShift = 0.4;
  const velChangeFactor = 0.2;
  const noiseFactor = 0.00001;

  const computeNextPoint = (lat: number, lon: number, bearing: number, dist: number) => {
    // NOTE: AI generated algorithm, not evaluated for correctness
    const lat1 = unitConverter.degToRad(lat);
    const lon1 = unitConverter.degToRad(lon);
    const cog = unitConverter.degToRad(bearing);

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist/EARTH_RADIUS)
               + Math.cos(lat1) * Math.sin(dist/EARTH_RADIUS) * Math.cos(cog));
    const lon2 = lon1
               + Math.atan2(
                 Math.sin(cog) * Math.sin(dist/EARTH_RADIUS) * Math.cos(lat1),
                 Math.cos(dist/EARTH_RADIUS) - Math.sin(lat1) * Math.sin(lat2)
               );
    return { lat: unitConverter.radToDeg(lat2), lon: unitConverter.radToDeg(lon2) };
  };

  const intervalId = setInterval(() => {
    if (vel > 10 && velShift < 0.5) {
      velShift = 0.6; // results in decreasing velocity
    } else if (vel < 2 && velShift > 0.5) {
      velShift = 0.4; // results in increasing velocity
    }
    vel = Math.max(0.0, vel + randUnitRangeFrom(-velShift) * velChangeFactor);

    course = (course + randUnitRangeFrom(-0.5) * courseDeltaMax + 360) % 360;
    if (++courseSteps > COURSE_MIN_STEPS && Math.random() < 0.2) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      course = (course + dir * randRange(45, 90) + 360) % 360;
      courseSteps = 0;
    }

    acc = acc < 2.5 ? acc : 0.9 * acc;

    const distance = vel * FREQ;
    let { lat, lon } = computeNextPoint(latitude, longitude, course, distance);

    latitude = lat;
    longitude = lon;
    lat += noiseFactor * acc * randUnitRangeFrom(-0.5);
    lon += noiseFactor * acc * randUnitRangeFrom(-0.5);

    fgWatchPositionCb({
      timestamp: Date.now(),
      mocked: true,
      coords: {
        latitude: lat,
        longitude: lon,
        accuracy: Math.random() < 0.05 ? null : acc,
        altitude: null,
        altitudeAccuracy: null,
        heading: course,
        speed: vel,
      },
    });
  }, FREQ * 1000);

  return {
    remove: () => {
      clearInterval(intervalId);
    },
  };
};


export default {
  requestPermissions,
  startBgLocationUpdates,
  stopBgLocationUpdates,
  subscribeToFgWatchPosition,
  subscribeToSimulatedFgWatchPosition,
};
