import { useEffect, useState } from 'react';

import location, {
  type LocationTaskExecutorBody,
  locObjToGeoPos,
} from '../modules/location';
import taskManager, {
  BG_TASK,
  type LocationTaskExecutorType,
} from '../background/taskManager';
import { addLocation } from '../store/slices/locationSlice';
import { useAppDispatch } from '../store/hooks';

const useLocation = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleBgTaskLocation: LocationTaskExecutorType<LocationTaskExecutorBody> = async ({ data, error }) => {
      if (error) {
        console.error('handleBgTaskLocation executor error:', error);
      } else if (data) {
        console.log('handleBgTaskLocation executor data:', data);
        data.locations.forEach(loc => {
          dispatch(addLocation(locObjToGeoPos(loc)));
        });
      }

      return Promise.resolve();
    };

    const startTracking = async () => {
      if (!taskManager.isTaskDefined(BG_TASK.Location)) {
        taskManager.defineTask<LocationTaskExecutorBody>(BG_TASK.Location , handleBgTaskLocation);
      }

      const permissionsGranted = await location.requestPermissions();
      if (permissionsGranted) {
        const isTrackingLocation = await location.startTracking();
        if (!isTrackingLocation) {
          console.error('TODO HANDLE: NOT tracking...');
        }
        setIsTracking(isTrackingLocation);
      } else {
        console.error('TODO HANDLE: No permissions to track location');
      }
    };

    const stopTracking = () => {
      setIsTracking(false);
      void location.stopTracking();
    };

    void startTracking();

    return stopTracking;
  }, [dispatch]);

  return { isInitialized: isTracking };
};

export default useLocation;
