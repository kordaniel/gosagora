import {
  type DateRange,
  type NonNullableFields,
} from '../types';
import { createReverseEnumMap } from '../utils/helpers';

import {
  type CreateRaceArguments,
  type RaceData,
} from '@common/types/rest_api';
import {
  RaceDetails,
  RaceType,
} from '@common/types/race';

export type NewRaceValuesType = NonNullableFields<Omit<CreateRaceArguments,
  'public' | 'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'
>> & {
  startEndDateRange: DateRange;
  registrationStartEndDateRange: DateRange;
};

export const RaceTypeLabelValueOptions = Object
  .entries(RaceType)
  .reduce<Array<{ label: string; value: string; }>>((acc, val) => {
    return [...acc, { label: val[0], value: val[1] }];
  }, []);

export const RaceTypeReverseMap = createReverseEnumMap(RaceType);

export const toRaceDetails = (race: RaceData): RaceDetails => {
  return {
    ...race,
    dateFrom: new Date(race.dateFrom),
    dateTo: new Date(race.dateTo),
    registrationOpenDate: new Date(race.registrationOpenDate),
    registrationCloseDate: new Date(race.registrationCloseDate),
  };
};
