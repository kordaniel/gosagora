import * as Yup from 'yup';

import { BoatType } from '@common/types/boat';
import { type SailboatData } from '@common/types/rest_api';

export const sailboatDataSchema: Yup.Schema<SailboatData> = Yup.object().shape({
  id: Yup.number()
    .required(),
  boatType: Yup.mixed<BoatType>()
    .oneOf([BoatType.Sailboat])
    .required(),
  name: Yup.string()
    .required(),
  sailNumber: Yup.string()
    .nullable()
    .defined(),
  description: Yup.string()
    .nullable()
    .defined(),
  users: Yup.array().of(
    Yup.object().shape({
      id: Yup.number()
        .required(),
      displayName: Yup.string()
        .required(),
    }),
  ).required(),
});
