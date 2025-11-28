import { useSyncExternalStore } from 'react';

import {
  fetchTrail,
  submitNewTrail,
} from '../store/slices/trailSlice';
import { type NewTrailValuesType } from '../models/trail';
import geoPosManager from '../modules/location/geoPosManager';
import { useAppDispatch } from '../store/hooks';
import useLocation from './useLocation';


const useTrailTracker = () => {
  const dispatch = useAppDispatch();
  const { startTracking } = useLocation(false);
  const trackingTrailId = useSyncExternalStore(geoPosManager.subscribe, geoPosManager.getTrackingTrailId);
  const locationTrackingStatus = useSyncExternalStore(geoPosManager.subscribe, geoPosManager.getLocationTrackingStatus);

  const startNewTrail = async (newTrailDetails: NewTrailValuesType): Promise<boolean> => {
    if (locationTrackingStatus.state === 'idle') {
      await startTracking();
    }
    const createdTrailId = await dispatch(submitNewTrail(newTrailDetails));
    if (createdTrailId === null) {
      return false;
    }

    geoPosManager.startTrackingTrail(createdTrailId);
    void dispatch(fetchTrail(createdTrailId));
    return true;
  };

  return {
    locationTrackingStatus,
    startNewTrail,
    trackingTrailId,
  };
};

export default useTrailTracker;
