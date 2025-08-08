import * as Yup from 'yup';

import {
  type UserDetailsData
} from '@common/types/rest_api';

export const userDetailsDataSchema: Yup.Schema<UserDetailsData> = Yup.object().shape({
  id: Yup.number()
    .required(),
  displayName: Yup.string()
    .required(),
  email: Yup.string()
    .required(),
  firebaseUid: Yup.string()
    .required(),
  lastseenAt: Yup.string()
    .nullable()
    .defined()
});
