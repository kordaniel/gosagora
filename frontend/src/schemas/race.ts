import * as Yup from 'yup';

import {
  type NewRaceValuesType,
  RaceTypeLabelValueOptions,
} from '../models/race';
import {
  getDateOffsetDaysFromNow,
  getYearLastDateYearsFromNow,
} from '../utils/dateTools';
import { type DateRange } from '../types';
import { FormInputType } from '../components/Form/enums';
import { type FormProps } from '../components/Form';
import config from '../utils/config';

import {
  type CreateRaceArguments,
  type RaceData,
  type RaceListingData,
  type RacePatchResponseData,
} from '@common/types/rest_api';
import { RaceType } from '@common/types/race';

export const raceListingDataSchema: Yup.Schema<RaceListingData> = Yup.object().shape({
  id: Yup.number()
    .required(),
  name: Yup.string()
    .required(),
  type: Yup.mixed<RaceType>()
    .oneOf(Object.values(RaceType))
    .required(),
  description: Yup.string()
    .required(),
  dateFrom: Yup.string()
    .required(),
  dateTo: Yup.string()
    .required(),
  user: Yup.object({
    id: Yup.number().required(),
    displayName: Yup.string().required()
  }).required()
});

export const raceListingDataArraySchema: Yup.Schema<RaceListingData[]> = Yup.array().of(
  raceListingDataSchema
).required();

export const raceDataSchema: Yup.Schema<RaceData> = Yup.object().shape({
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

export const newRaceValidationSchema: Yup.Schema<NewRaceValuesType> = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, 'Race name must be at least 4 characters long')
    .max(128, 'Race name can not be longer than 256 characters')
    .required('Race name is required'),
  type: Yup.mixed<RaceType>()
    .oneOf(Object.values(RaceType), `Race type must be selected from the list of:\n- ${Object.keys(RaceType).join('\n- ')}`)
    .required('Race type selection is required'),
  url: Yup.string()
    .trim()
    .test(
      'url-is-empty-or-certain-length-str',
      'Optional Url, if provided must be a valid url prefixed with http(s)://', // Only rendered if test function returns a literal false boolean
      (value: string | undefined, ctx: Yup.TestContext<Yup.AnyObject>) => {
        if (value === undefined || value === '') {
          return true;
        }

        if (value.length < 8) {
          return ctx.createError({
            message: 'Url must be at least 8 characters long',
          });
        }
        if (value.length > 256) {
          return ctx.createError({
            message: 'Url can not be longer than 256 characters',
          });
        }

        return true;
      },
    )
    .url('Please enter a valid URL that starts with http(s)://')
    .default(''),
  email: Yup.string()
    .trim()
    .test(
      'email-is-empty-or-certain-length-str',
      'Optional Email', // Only rendered if test function returns a literal false boolean
      (value: string | undefined, ctx: Yup.TestContext<Yup.AnyObject>) => {
        if (value === undefined || value === '') {
          return true;
        }

        if (value.length < 8) {
          return ctx.createError({
            message: 'Email must be at least 8 characters long',
          });
        }
        if (value.length > 256) {
          return ctx.createError({
            message: 'Email can not be longer than 256 characters',
          });
        }

        return true;
      }
    )
    .email('Please enter a valid email address')
    .default(''),
  startEndDateRange: Yup.object().shape({
    startDate: Yup.date()
      .required('Race starting date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'Race ending date can not be earlier than start date')
      .required('Race ending date is required'),
  }),
  registrationStartEndDateRange: Yup.object().shape({
    startDate: Yup.date()
      .required('Registration starting date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'Registration ending date can not be earlier than registration opening date')
      .required('Registration ending date is required'),
  }),
  description: Yup.string()
    .trim()
    .min(4, 'Description must be at least 4 characters long')
    .max(2000, 'Description can not be longer than 2000 characters')
    .required('A description is required'),
});

export const patchRaceSchema: Yup.Schema<RacePatchResponseData> = Yup.object().shape({
  raceData: raceDataSchema,
  raceListingData: Yup.object().shape({
    id: Yup.number()
      .required(),
    name: Yup.string()
      .required(),
    type: Yup.mixed<RaceType>()
      .oneOf(Object.values(RaceType))
      .required(),
    description: Yup.string()
      .required(),
    dateFrom: Yup.string()
      .required(),
    dateTo: Yup.string()
      .required(),
    user: Yup.object().shape({
      id: Yup.number()
        .required(),
      displayName: Yup.string()
        .required(),
    })
  })
});

interface RaceFormFieldsInitialValues {
  name: string;
  type: RaceType;
  url: string;
  email: string;
  startEndDateRange: DateRange;
  registrationStartEndDateRange: DateRange;
  description: string;
}

export const createRaceFormFields = (
  initialValues?: RaceFormFieldsInitialValues
): FormProps<NewRaceValuesType>['formFields'] => ({
  name: {
    inputType: FormInputType.TextField,
    ...(initialValues?.name && { initialValue: initialValues.name }),
    label: config.IS_MOBILE ? undefined : 'Race name',
    placeholder: 'Race name',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: false,
      autoFocus: config.IS_MOBILE ? false : true,
      inputMode: 'text',
    },
  },
  type: {
    inputType: FormInputType.SelectDropdown,
    ...(initialValues?.type && { initialValue: initialValues.type }),
    label: config.IS_MOBILE ? undefined : 'Race type',
    placeholder: 'Select race type',
    options: RaceTypeLabelValueOptions,
  },
  url: {
    inputType: FormInputType.TextField,
    ...(initialValues?.url && { initialValue: initialValues.url }),
    label: 'Web address',
    placeholder: 'https://optional.com/',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'url',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'url',
    },
  },
  email: {
    inputType: FormInputType.TextField,
    ...(initialValues?.email && { initialValue: initialValues.email }),
    label: 'Email address',
    placeholder: 'optional@email.com',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'email',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'email',
    },
  },
  startEndDateRange: {
    inputType: FormInputType.RangeDatePicker,
    ...(initialValues?.startEndDateRange && { initialValue: initialValues.startEndDateRange }),
    label: 'Race start and end dates',
    datePickerModalOpenerLabel: 'Select timespan for race',
    props: {
      endYear: new Date().getFullYear() + 1,
      startYear: new Date().getFullYear(),
      validRange: {
        startDate: getDateOffsetDaysFromNow(-1),
        endDate: getYearLastDateYearsFromNow(1),
      },
    },
  },
  registrationStartEndDateRange: {
    inputType: FormInputType.RangeDatePicker,
    ...(initialValues?.registrationStartEndDateRange && { initialValue: initialValues.registrationStartEndDateRange }),
    label: 'Registration start and end dates',
    datePickerModalOpenerLabel: 'Select timespan for registration',
    props: {
      endYear: new Date().getFullYear() + 1,
      startYear: new Date().getFullYear(),
      validRange: {
        startDate: getDateOffsetDaysFromNow(-1),
        endDate: getYearLastDateYearsFromNow(1),
      },
    },
  },
  description: {
    inputType: FormInputType.TextField,
    ...(initialValues?.description && { initialValue: initialValues.description }),
    label: config.IS_MOBILE ? undefined : 'Race description',
    placeholder: 'Race description',
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

export function raceValuesToRaceArguments(newValues: NewRaceValuesType): CreateRaceArguments;
export function raceValuesToRaceArguments(newValues: NewRaceValuesType, oldValues: RaceData ): Partial<CreateRaceArguments> | null;
export function raceValuesToRaceArguments(
  newValues: NewRaceValuesType,
  oldValues?: RaceData
): CreateRaceArguments | Partial<CreateRaceArguments> | null {
  const cmpEmptyNullStrVals = (newVal: string, oldVal: string | null) => {
    const parsed = newVal ? newVal.trim() : null;
    return parsed === oldVal;
  };

  const extractDates = (
    newDates: Pick<NewRaceValuesType, 'startEndDateRange' | 'registrationStartEndDateRange'>,
    oldDates?: Pick<RaceData, 'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'>
  ): Pick<RaceData, 'dateFrom' | 'dateTo' | 'registrationOpenDate' | 'registrationCloseDate'>  | Record<string, never> => {
    if (oldDates &&
      newDates.startEndDateRange.startDate.toISOString() === oldDates.dateFrom &&
      newDates.startEndDateRange.endDate.toISOString() === oldDates.dateTo &&
      newDates.registrationStartEndDateRange.startDate.toISOString() === oldDates.registrationOpenDate &&
      newDates.registrationStartEndDateRange.endDate.toISOString() === oldDates.registrationCloseDate
    ) {
      return {};
    }

    return {
      dateFrom: newDates.startEndDateRange.startDate.toISOString(),
      dateTo: newDates.startEndDateRange.endDate.toISOString(),
      registrationOpenDate: newDates.registrationStartEndDateRange.startDate.toISOString(),
      registrationCloseDate: newDates.registrationStartEndDateRange.endDate.toISOString(),
    };
  };

  const values = {
    ...((!oldValues || newValues.name.trim() !== oldValues.name) && { name: newValues.name.trim() }),
    ...((!oldValues || newValues.type !== oldValues.type) && { type: newValues.type }),
    ...((!oldValues || !cmpEmptyNullStrVals(newValues.url, oldValues.url)) && { url: newValues.url ? newValues.url.trim() : null }),
    ...((!oldValues || !cmpEmptyNullStrVals(newValues.email, oldValues.email)) && { email: newValues.email ? newValues.email.trim() : null }),
    ...((!oldValues || newValues.description.trim() !== oldValues.description) && { description: newValues.description.trim() }),
    ...extractDates(newValues, oldValues)
  };

  return Object.keys(values).length === 0 ? null : values;
}
