import * as Yup from 'yup';

import { FormInputType } from '../components/Form/enums';
import { type FormProps } from '../components/Form';
import { type NewSailboatValuesType } from '../models/boat';
import config from '../utils/config';

import {
  type CreateSailboatArguments,
  type SailboatData
} from '@common/types/rest_api';
import { BoatType } from '@common/types/boat';

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
  userIdentities: Yup.array().of(
    Yup.object().shape({
      id: Yup.number()
        .required(),
      displayName: Yup.string()
        .required(),
    }),
  ).required(),
});

export const newSailboatValidationSchema: Yup.Schema<NewSailboatValuesType> = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Boat name must be at least 2 characters long')
    .max(64, 'Boat name can not be longer than 64 characters')
    .required('Boat name is required'),
  sailNumber: Yup.string()
    .trim()
    .max(16, 'Sail Number can not be longer than 16 characters')
    .default(''),
  description: Yup.string()
    .trim()
    .test(
      'description-is-empty-or-certain-length-str',
      'Optional Description', // Only rendered if test function returns a literal false boolean
      (value: string | undefined, ctx: Yup.TestContext<Yup.AnyObject>) => {
        if (value === undefined || value === '') {
          return true;
        }

        if (value.length < 4) {
          return ctx.createError({
            message: 'Description must be at least 4 characters long',
          });
        }
        if (value.length > 256) {
          return ctx.createError({
            message: 'Description can not be longer than 256 characters'
          });
        }

        return true;
      }
    )
    .default(''),
});

export const createNewSailboatFormFields = (
  initialValues?: NewSailboatValuesType
): FormProps<NewSailboatValuesType>['formFields'] => ({
  name: {
    inputType: FormInputType.TextField,
    ...(initialValues?.name && { initialValue: initialValues.name }),
    label: config.IS_MOBILE ? undefined : 'Boat Name',
    placeholder: 'Boat Name',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'text',
    },
  },
  sailNumber: {
    inputType: FormInputType.TextField,
    ...(initialValues?.sailNumber && { initialValue: initialValues.sailNumber }),
    label: config.IS_MOBILE ? undefined : 'Sail Number',
    placeholder: 'Sail Number (Optional)',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'text',
    },
  },
  description: {
    inputType: FormInputType.TextField,
    ...(initialValues?.description && { initialValue: initialValues.description }),
    label: config.IS_MOBILE ? undefined : 'Boat Description',
    placeholder: 'Boat Description (Optional)',
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
});

export function newSailboatValuesToCreateSailboatArguments(
  newValues: NewSailboatValuesType
): CreateSailboatArguments;
export function newSailboatValuesToCreateSailboatArguments(
  newValues: NewSailboatValuesType,
  oldValues: Pick<SailboatData, 'name' | 'sailNumber' | 'description'>
): Partial<CreateSailboatArguments> | null;
export function newSailboatValuesToCreateSailboatArguments(
  newValues: NewSailboatValuesType,
  oldValues?: Pick<SailboatData, 'name' | 'sailNumber' | 'description'>
): CreateSailboatArguments | Partial<CreateSailboatArguments> | null {
  const cmpEmptyNullStrVals = (newVal: string, oldVal: string | null) => {
    const parsed = newVal ? newVal.trim() : null;
    return parsed === oldVal;
  };

  const values = {
    ...((!oldValues || newValues.name.trim() !== oldValues.name) && { name: newValues.name.trim() }),
    ...((!oldValues || !cmpEmptyNullStrVals(newValues.sailNumber.toUpperCase(), oldValues.sailNumber)) && { sailNumber: newValues.sailNumber ? newValues.sailNumber.trim().toUpperCase() : null }),
    ...((!oldValues || !cmpEmptyNullStrVals(newValues.description, oldValues.description)) && { description: newValues.description ? newValues.description.trim() : null })
  };

  return Object.keys(values).length === 0 ? null : values;
}
