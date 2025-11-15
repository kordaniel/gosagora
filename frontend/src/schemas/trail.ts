import * as Yup from 'yup';

import { boatIdentitySchema, userIdentitySchema } from './identities';
import { FormInputType } from '../components/Form/enums';
import { type FormProps } from '../components/Form';
import { type NewTrailValuesType } from '../models/trail';
import config from '../utils/config';

import type {
  CreateTrailArguments,
  TrailListingData,
} from '@common/types/rest_api';
import type { BoatIdentity } from '@common/types/boat';

export const trailListingDataSchema: Yup.Schema<TrailListingData> = Yup.object().shape({
  id: Yup.number()
    .required(),
  name: Yup.string()
    .required(),
  startDate: Yup.string()
    .required(),
  endDate: Yup.string()
    .nullable()
    .defined(),
  user: userIdentitySchema,
  boat: boatIdentitySchema,
});

export const trailListingDataArraySchema: Yup.Schema<TrailListingData[]> = Yup.array().of(
  trailListingDataSchema
).required();

export const newTrailValidationSchema: Yup.Schema<NewTrailValuesType> = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, 'Trail name must be at least 4 characters long')
    .max(128, 'Trail name can not be longer than 128 characters')
    .required('Trail name is required'),
  sailboatId: Yup.string()
    .trim()
    .required('You must select a boat for your new trail'),
  description: Yup.string()
    .trim()
    .min(4, 'Description must be at least 4 characters long')
    .max(2000, 'Description can not be longer than 2000 characters')
    .required('A description is required'),
  public: Yup.boolean()
    .required(),
});

export const createTrailFormFields = (
  userBoatIdentities: BoatIdentity[]
): FormProps<NewTrailValuesType>['formFields'] => ({
  name: {
    inputType: FormInputType.TextField,
    label: config.IS_MOBILE ? undefined : 'Trail name',
    placeholder: 'Trail name',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      autoFocus: config.IS_MOBILE ? false : true,
      inputMode: 'text',
    },
  },
  sailboatId: {
    inputType: FormInputType.SelectDropdown,
    label: config.IS_MOBILE ? undefined : 'Select boat',
    placeholder: 'Select boat',
    options: userBoatIdentities.map(b => ({ label: b.name, value: b.id.toString() })),
  },
  description: {
    inputType: FormInputType.TextField,
    label: config.IS_MOBILE ? undefined : 'Trail description',
    placeholder: 'Trail description',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: true,
      autoFocus: false,
      inputMode: 'text',
      multiline: true,
      numberOfLines: 3,
      textAlignVertical: 'top',
    },
  },
  public: {
    inputType: FormInputType.Checkbox,
    checkboxText: 'Share with everyone',
    initialValue: true,
  }
});

export function trailValuesToTrailArguments(
  newValues: NewTrailValuesType
): CreateTrailArguments {
  return {
    name: newValues.name.trim(),
    description: newValues.description.trim(),
    public: newValues.public,
    sailboatId: parseInt(newValues.sailboatId, 10),
  };
}
