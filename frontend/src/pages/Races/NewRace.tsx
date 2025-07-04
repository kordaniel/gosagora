import React from 'react';

import * as Yup from 'yup';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../../components/Form';
import { FormInputType } from '../../components/Form/enums';

import ErrorRenderer from '../../components/ErrorRenderer';
import StyledText from '../../components/StyledText';

import {
  type NewRaceValuesType,
  SelectSubmittingNewRace,
  fetchRace,
  submitNewRace,
} from '../../store/slices/raceSlice';
import {
  getDateOffsetDaysFromNow,
  getYearLastDateYearsFromNow,
} from '../../utils/dateTools';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { type AppTheme, } from '../../types';
import { RaceTypeLabelValueOptions } from '../../models/race';
import { type SceneMapRouteProps } from './index';
import config from '../../utils/config';

import { RaceType } from '@common/types/race';

const validationSchema: Yup.Schema<NewRaceValuesType> = Yup.object().shape({
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

const formFields: FormProps<NewRaceValuesType>['formFields'] = {
  name: {
    inputType: FormInputType.TextField,
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
    label: config.IS_MOBILE ? undefined : 'Race type',
    placeholder: 'Select race type',
    options: RaceTypeLabelValueOptions,
  },
  url: {
    inputType: FormInputType.TextField,
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
};

const NewRace = ({ jumpTo }: SceneMapRouteProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme<AppTheme>();
  const {
    setSubmittingNewRaceLoading,
    submittingNewRaceError,
  } = useAppSelector(SelectSubmittingNewRace);

  const onSubmit = async (raceDetails: NewRaceValuesType): Promise<boolean> => {
    const createdRaceId = await dispatch(submitNewRace(raceDetails));
    if (createdRaceId === null) {
      return false;
    }

    void dispatch(fetchRace(createdRaceId));
    jumpTo('raceView');
    return true;
  };

  return (
    <ScrollView contentContainerStyle={theme.styles.primaryContainer}>
      <StyledText variant="headline">New race</StyledText>
      <ErrorRenderer>{submittingNewRaceError}</ErrorRenderer>
      <Form<NewRaceValuesType>
        formFields={formFields}
        onSubmit={onSubmit}
        submitLabel="Create new race"
        validationSchema={validationSchema}
      />
      {setSubmittingNewRaceLoading && <ActivityIndicator color={theme.colors.onPrimaryContainer} size="large" />}
    </ScrollView>
  );
};

export default NewRace;
