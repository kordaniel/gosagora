import React from 'react';

import * as Yup from 'yup';
import type { FormikHelpers, FormikValues } from 'formik';
import type { GestureResponderEvent, TextInputProps } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';

import StyledText from '../StyledText';
import TextField from './TextField';

interface FormFields {
  [key:string]: {
    label: string;
    placeholder: string;
    props?: TextInputProps;
  };
}

interface FormProps<T> {
  formFields: FormFields;
  onSubmit: (values: T) => void;
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
  const handleOnSubmit = (
    values: FormValuesType,
    { setSubmitting }: FormikHelpers<FormValuesType>
  ) => {
    onSubmit(values);
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
      {({ handleSubmit }) => {
        return (
          <View>
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
            <Pressable
              style={styles.submitButton}
              onPress={handleSubmit as (e?: GestureResponderEvent) => void}
            >
              <StyledText>{submitLabel}</StyledText>
            </Pressable>
          </View>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    width: 104,
  }
});

export default Form;
