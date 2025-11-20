import { useSyncExternalStore } from 'react';

import {
  fetchTrail,
  submitNewTrail,
} from '../store/slices/trailSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { type NewTrailValuesType } from '../models/trail';
import { SelectLocation } from '../store/slices/locationSlice';
import geoPosManager from '../modules/location/geoPosManager';
import useLocation from './useLocation';

const useTrailTracker = () => {
  const dispatch = useAppDispatch();
  const { startTracking } = useLocation();
  const { trackingStatus } = useAppSelector(SelectLocation);
  const trackingTrailId = useSyncExternalStore(geoPosManager.subscribe, geoPosManager.getTrackingTrailId);

  const startNewTrail = async (newTrailDetails: NewTrailValuesType): Promise<boolean> => {
    if (trackingStatus === 'idle') {
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
    startNewTrail,
    trackingTrailId,
  };
};

export default useTrailTracker;
