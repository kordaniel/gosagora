import { useCallback, useEffect, useState } from 'react';

import { ApplicationError } from '../errors/applicationError';
import type { NonNullableFields } from '../types';
import raceService from '../services/raceService';

import { CreateRaceArguments } from '@common/types/rest_api';
import { RaceListing } from '@common/types/race';

const useRace = () => {
  const [races, setRaces] = useState<RaceListing[] | null>(null);
  const [racesError, setRacesError] = useState<string>('');
  const [racesLoading, setRacesLoading] = useState<boolean>(false);
  const [submitNewRaceError, setSubmitNewRaceError] = useState<string>('');
  const [submitNewRaceLoading, setSubmitNewRaceLoading] = useState<boolean>(false);

  const fetchRaces = useCallback(async () => {
    setRacesLoading(true);
    try {
      const data = await raceService.getAll();
      setRaces(data);
      setRacesError('');
    } catch (err: unknown) {
      if (err instanceof ApplicationError) {
        setRacesError(err.message);
      } else {
        setRacesError('unknown error happened');
        console.error('getting races unhandled err:', err);
      }
    }
    setRacesLoading(false);
  }, []);

  useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  const submitNewRace = async (raceDetails: NonNullableFields<CreateRaceArguments>) => {
    setSubmitNewRaceLoading(true);
    try {
      await raceService.create({
        name: raceDetails.name.trim(),
        type: raceDetails.type,
        url: raceDetails.url ? raceDetails.url.trim() : null,
        email: raceDetails.email ? raceDetails.email.trim() : null,
        description: raceDetails.description.trim(),
      });
      setSubmitNewRaceError('');
    } catch (err: unknown) {
      if (err instanceof ApplicationError) {
        setSubmitNewRaceError(err.message);
      } else {
        setSubmitNewRaceError('Unknown error. Please try again.');
        console.error('unhandled POST err:', err);
      }
    }
    setSubmitNewRaceLoading(false);
  };

  return {
    races,
    racesError,
    racesLoading,
    racesRefetch: fetchRaces,
    submitNewRace,
    submitNewRaceError,
    submitNewRaceLoading,
  };
};

export default useRace;
