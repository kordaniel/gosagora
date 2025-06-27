import { useCallback, useEffect, useState } from 'react';

import type { DateRange, NonNullableFields } from '../types';
import { ApplicationError } from '../errors/applicationError';
import raceService from '../services/raceService';

import type { CreateRaceArguments } from '@common/types/rest_api';
import type { RaceListing } from '@common/types/race';

export type NewRaceValuesType = NonNullableFields<Omit<CreateRaceArguments,
  'public' | 'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'
>> & {
  startEndDateRange: DateRange;
  registrationStartEndDateRange: DateRange;
};

const useRace = () => {
  const [races, setRaces] = useState<RaceListing[]>([]);
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

  const submitNewRace = async (raceDetails: NewRaceValuesType): Promise<boolean> => {
    setSubmitNewRaceLoading(true);
    try {
      const newRace = await raceService.create({
        name: raceDetails.name.trim(),
        type: raceDetails.type,
        url: raceDetails.url ? raceDetails.url.trim() : null,
        email: raceDetails.email ? raceDetails.email.trim() : null,
        dateFrom: raceDetails.startEndDateRange.startDate.toISOString(),
        dateTo: raceDetails.startEndDateRange.endDate.toISOString(),
        registrationOpenDate: raceDetails.registrationStartEndDateRange.startDate.toISOString(),
        registrationCloseDate: raceDetails.registrationStartEndDateRange.endDate.toISOString(),
        description: raceDetails.description.trim(),
      });
      setRaces([...races, newRace]);
      setSubmitNewRaceError('');
      setSubmitNewRaceLoading(false);
      return true;
    } catch (err: unknown) {
      if (err instanceof ApplicationError) {
        setSubmitNewRaceError(err.message);
      } else {
        setSubmitNewRaceError('Unknown error. Please try again.');
        console.error('unhandled POST err:', err);
      }
      setSubmitNewRaceLoading(false);
      return false;
    }
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
