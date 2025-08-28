import * as Yup from 'yup';

import { type BoatIdentity, BoatType } from '@common/types/boat';
import { type UserIdentity } from '@common/types/user';

export const boatIdentitySchema: Yup.Schema<BoatIdentity> = Yup.object().shape({
  id: Yup.number()
    .required(),
  boatType: Yup.mixed<BoatType>()
    .oneOf(Object.values(BoatType))
    .required(),
  name: Yup.string()
    .required(),
});

export const userIdentitySchema: Yup.Schema<UserIdentity> = Yup.object().shape({
  id: Yup.number().required(),
  displayName: Yup.string().required(),
});
