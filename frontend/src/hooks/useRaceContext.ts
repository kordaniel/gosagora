import { createContext, useContext } from 'react';

import type useRace from './useRace';

export const RaceContext = createContext<ReturnType<typeof useRace> | null>(null);

export const useRaceContext = () => {
  return useContext(RaceContext);
};
