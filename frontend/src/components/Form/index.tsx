import React from 'react';

import * as Yup from 'yup';
import type { FormikHelpers, FormikValues } from 'formik';
import type { GestureResponderEvent, TextInputProps } from 'react-native';
import { Formik } from 'formik';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../Button';
import TextField from './TextField';

import type { AppTheme } from '../../types';

interface FormFields {
  [key:string]: {
    label?: string;
    placeholder: string;
    props?: TextInputProps;
  };
}

export interface FormProps<T> {
  formFields: FormFields;
  onSubmit: (values: T) => Promise<void>;
  submitLabel: string;
  validationSchema: Yup.Schema<T>;
}

type FormikStringValues = {
  [P in keyof FormikValues]: string;
};

const Form = <FormValuesType extends FormikStringValues, >({
  formFields,
  onSubmit,
  submitLabel,
  validationSchema
}: FormProps<FormValuesType>) => {
  const theme = useTheme<AppTheme>();

  const handleOnSubmit = async (
    values: FormValuesType,
    { setSubmitting }: FormikHelpers<FormValuesType>
  ) => {
    await onSubmit(values);
    setSubmitting(false);
  };

  const initialValues: FormValuesType = Object
    .entries(formFields)
    .reduce((acc, field) => {
      Object.assign(acc, { [field[0]]: '' });
      return acc;
    }, {}) as FormValuesType;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isValid, isSubmitting }) => {
        return (
          <View style={theme.styles.containerFlexColumn}>
            {Object.entries(formFields).map(([field, val]) => (
              <TextField
                key={field}
                name={field}
                label={val.label}
                placeholder={val.placeholder}
                textInputProps={val.props}
              />
            ))}
            {/* 2025-04-19: onPress handleSubmit cb type must be casted: https://github.com/jaredpalmer/formik/issues/3643 */}
            <Button
              ctxLoading={isSubmitting}
              disabled={!isValid || isSubmitting}
              onPress={handleSubmit as (e?: GestureResponderEvent) => void}
            >
              {submitLabel}
            </Button>
          </View>
        );
      }}
    </Formik>
  );
};

export default Form;
