import { createReverseEnumMap } from '../utils/helpers';

import { RaceType } from '@common/types/race';

export const RaceTypeLabelValueOptions = Object
  .entries(RaceType)
  .reduce<Array<{ label: string; value: string; }>>((acc, val) => {
    return [...acc, { label: val[0], value: val[1] }];
  }, []);

export const RaceTypeReverseMap = createReverseEnumMap(RaceType);
