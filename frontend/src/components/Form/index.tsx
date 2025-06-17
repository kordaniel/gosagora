import React from 'react';

import * as Yup from 'yup';
import {
  Formik,
  type FormikHelpers,
  type FormikValues
} from 'formik';
import {
  type GestureResponderEvent,
  type TextInputProps,
  View
} from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../Button';
import SelectDropdown from './SelectDropdown';
import TextField from './TextField';

import type { AppTheme } from '../../types';
import { FormInputType } from './enums';

import { assertNever } from '../../utils/typeguards';

interface FormFieldBase {
  label?: string;
  placeholder: string;
}

interface FormFieldTextField extends FormFieldBase {
  inputType: FormInputType.TextField;
  props?: TextInputProps;
}

interface FormFieldSelectDropdown extends FormFieldBase {
  inputType: FormInputType.SelectDropdown;
  options: Array<{ label: string; value: string; }>;
}

type FormField =
  | FormFieldTextField
  | FormFieldSelectDropdown;

interface FormFields {
  [key:string]: FormField;
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

  const style = [
    theme.styles.containerFlexColumn,
    theme.styles.primaryContainer
  ];

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
          <View style={style}>
            {Object.entries(formFields).map(([field, val]) => {
              switch (val.inputType) {
                case FormInputType.TextField:
                  return <TextField
                    key={field}
                    name={field}
                    label={val.label}
                    placeholder={val.placeholder}
                    textInputProps={val.props}
                  />;
                case FormInputType.SelectDropdown:
                  return <SelectDropdown
                    key={field}
                    name={field}
                    label={val.label}
                    placeholder={val.placeholder}
                    options={val.options}
                  />;
                default:
                  return assertNever(val);
              }
            })}
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
