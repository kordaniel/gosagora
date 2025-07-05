import * as Yup from 'yup';

import { RaceData } from '@common/types/rest_api';
import { RaceType } from '@common/types/race';

export const raceSchema: Yup.Schema<RaceData> = Yup.object().shape({
  id: Yup.number()
    .required(),
  public: Yup.boolean()
    .required(),
  name: Yup.string()
    .required(),
  type: Yup.mixed<RaceType>()
    .oneOf(Object.values(RaceType))
    .required(),
  url: Yup.string()
    .nullable()
    .defined(),
  email: Yup.string()
    .nullable()
    .defined(),
  description: Yup.string()
    .required(),
  dateFrom: Yup.string()
    .required(),
  dateTo: Yup.string()
    .required(),
  registrationOpenDate: Yup.string()
    .required(),
  registrationCloseDate: Yup.string()
    .required(),
  user: Yup.object({
    id: Yup.number().required(),
    displayName: Yup.string().required()
  }).required()
});
