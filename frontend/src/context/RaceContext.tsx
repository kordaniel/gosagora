import React, { type ReactNode } from 'react';

import { RaceContext } from '../hooks/useRaceContext';
import useRace from '../hooks/useRace';

interface RaceContextProviderProps {
  children: ReactNode;
}

export const RaceContextProvider = ({ children }: RaceContextProviderProps) => {
  const race = useRace();

  return (
    <RaceContext.Provider value={race}>
      {children}
    </RaceContext.Provider>
  );
};
