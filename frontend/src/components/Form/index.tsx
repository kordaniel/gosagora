import React, { useRef } from 'react';

import * as Yup from 'yup';
import {
  Formik,
  type FormikHelpers,
  type FormikProps,
  type FormikValues,
} from 'formik';
import {
  type GestureResponderEvent,
  type TextInputProps,
  View
} from 'react-native';
import { useTheme } from 'react-native-paper';

import Checkbox, { type RNPCheckboxProps } from './Checkbox';
import InputDatePicker, { type DatePickerInputProps } from './InputDatePicker';
import RangeDatePicker, { type DatePickerModalProps } from './RangeDatePicker';
import Button from '../Button';
import SelectDropdown from './SelectDropdown';
import TextField from './TextField';

import type {
  AppTheme,
  DateRange,
  WithRequiredFields,
} from '../../types';
import {
  assertNever,
  isDateRange,
  isString,
} from '../../utils/typeguards';
import { FormInputType } from './enums';


interface FormFieldBase<T extends FormInputType> {
  inputType: T;
  label?: string;
}

interface FormFieldCheckbox extends FormFieldBase<FormInputType.Checkbox> {
  initialValue?: boolean;
  checkboxText: string;
  props?: RNPCheckboxProps;
}

interface FormFieldInputDatePicker extends WithRequiredFields<
  FormFieldBase<FormInputType.InputDatePicker>, 'label'
> {
  initialValue: Date | undefined;
  props?: DatePickerInputProps;
}

interface FormFieldRangeDatePicker extends FormFieldBase<FormInputType.RangeDatePicker> {
  initialValue?: DateRange;
  datePickerModalOpenerLabel?: string;
  props?: DatePickerModalProps;
}

interface FormFieldSelectDropdown extends FormFieldBase<FormInputType.SelectDropdown> { // default
  initialValue?: string;
  placeholder: string;
  options: Array<{ label: string; value: string; }>;
}

interface FormFieldTextField extends FormFieldBase<FormInputType.TextField> {
  initialValue?: string;
  placeholder: string;
  props?: TextInputProps;
}

type FormField =
  | FormFieldCheckbox
  | FormFieldInputDatePicker
  | FormFieldRangeDatePicker
  | FormFieldSelectDropdown
  | FormFieldTextField;

interface FormFields {
  [key:string]: FormField;
}

export interface FormProps<T> {
  formFields: FormFields;
  onSubmit: (values: T) => Promise<void | boolean>;
  submitLabel: string;
  validationSchema: Yup.Schema<T>;
  clearFieldsAfterSubmit?: boolean;
}

type FormikValuesType = {
  [P in keyof FormikValues]: string | Date | Partial<DateRange> | boolean;
};

const Form = <FormValuesType extends FormikValuesType, >({
  formFields,
  onSubmit,
  submitLabel,
  validationSchema,
  clearFieldsAfterSubmit = true
}: FormProps<FormValuesType>) => {
  const theme = useTheme<AppTheme>();
  const formikRef = useRef<FormikProps<FormValuesType>>(null);

  const style = [
    theme.styles.containerFlexColumn,
    theme.styles.primaryContainer,
    theme.styles.stretchContainer,
  ];

  const handleOnSubmit = async (
    values: FormValuesType,
    { setSubmitting }: FormikHelpers<FormValuesType>
  ) => {
    const submitResult = await onSubmit(values);
    if (formikRef.current && clearFieldsAfterSubmit && (submitResult ?? true)) {
      formikRef.current.resetForm();
    }
    setSubmitting(false);
  };

  const initialValues: FormValuesType = Object
    .entries(formFields)
    .reduce((acc, field) => {
      const inputType = field[1].inputType;
      switch (inputType) {
        case FormInputType.Checkbox:
          if (('initialValue' in field[1]) && typeof field[1].initialValue === 'boolean') {
            Object.assign(acc, { [field[0]]: field[1].initialValue });
          } else {
            Object.assign(acc, { [field[0]]: false });
          }
          break;
        case FormInputType.InputDatePicker:
          Object.assign(acc, { [field[0]]: field[1].initialValue });
          break;
        case FormInputType.RangeDatePicker:
          if (isDateRange(field[1].initialValue)) {
            Object.assign(acc, { [field[0]]: field[1].initialValue });
          } else {
            Object.assign(acc, { [field[0]]: { startDate: undefined, endDate: undefined } });
          }
          break;
        case FormInputType.SelectDropdown:
          if ('initialValue' in field[1] && isString(field[1].initialValue)) {
            Object.assign(acc, { [field[0]]: field[1].initialValue });
          } else {
            Object.assign(acc, { [field[0]]: '' });
          }
          break;
        case FormInputType.TextField:
          if ('initialValue' in field[1] && isString(field[1].initialValue)) {
            Object.assign(acc, { [field[0]]: field[1].initialValue });
          } else {
            Object.assign(acc, { [field[0]]: '' });
          }
          break;
        default:
          assertNever(inputType);
      }
      return acc;
    }, {}) as FormValuesType;

  return (
    <Formik
      initialValues={initialValues}
      innerRef={formikRef}
      onSubmit={handleOnSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isValid, isSubmitting }) => {
        return (
          <View style={style}>
            {Object.entries(formFields).map(([field, val]) => {
              switch (val.inputType) {
                case FormInputType.Checkbox:
                  return <Checkbox
                    key={field}
                    name={field}
                    label={val.label}
                    checkboxProps={val.props}
                    checkboxText={val.checkboxText}
                  />;
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
                case FormInputType.InputDatePicker:
                  return <InputDatePicker
                    key={field}
                    name={field}
                    label={val.label}
                    datePickerInputProps={val.props}
                  />;
                case FormInputType.RangeDatePicker:
                  return <RangeDatePicker
                    key={field}
                    name={field}
                    label={val.label}
                    datePickerModalOpenerLabel={val.datePickerModalOpenerLabel}
                    datePickerModalProps={val.props}
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
