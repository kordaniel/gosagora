import React from 'react';

import * as Yup from 'yup';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Form, { type FormProps } from '../../components/Form';
import { FormInputType } from '../../components/Form/enums';

import ErrorRenderer from '../../components/ErrorRenderer';
import StyledText from 'src/components/StyledText';

import {
  type AppTheme,
  type NonNullableFields,
  RaceTypeOptions,
} from 'src/types';
import config from '../../utils/config';

import { type CreateRaceArguments } from '@common/types/rest_api';
import { RaceType } from '@common/types/race';

type NewRaceValuesType = NonNullableFields<CreateRaceArguments>;

const validationSchema: Yup.Schema<NewRaceValuesType> = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, 'Name must be at least 4 characters long')
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
    .url()
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
    .email()
    .default(''),
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
      autoFocus: true,
      inputMode: 'text',
    },
  },
  type: {
    inputType: FormInputType.SelectDropdown,
    label: config.IS_MOBILE ? undefined : 'Race type',
    placeholder: 'Select race type',
    options: RaceTypeOptions,
  },
  url: {
    inputType: FormInputType.TextField,
    label: config.IS_MOBILE ? undefined : 'Web',
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
    label: config.IS_MOBILE ? undefined : 'Email',
    placeholder: 'optional@email.com',
    props: {
      autoCapitalize: 'none',
      autoComplete: 'email',
      autoCorrect: false,
      autoFocus: false,
      inputMode: 'email',
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
    },
  },
};

interface NewRaceProps {
  error: string;
  loading: boolean;
  handleSubmit: (raceDetails: NewRaceValuesType) => Promise<void>;
}

const NewRace = ({ error, loading, handleSubmit }: NewRaceProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={theme.styles.primaryContainer}>
      <StyledText variant="headline">New race</StyledText>
      <ErrorRenderer>{error}</ErrorRenderer>
      <Form<NewRaceValuesType>
        formFields={formFields}
        onSubmit={handleSubmit}
        submitLabel="Create new race"
        validationSchema={validationSchema}
      />
      {loading && <ActivityIndicator color={theme.colors.onPrimaryContainer} size="large" />}
    </View>
  );
};

export default NewRace;
