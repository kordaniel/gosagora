import React from 'react';

import { DatePickerInput } from 'react-native-paper-dates';
import { useField } from 'formik';

import FieldBase, { type FieldBaseProps } from './FieldBase';

import type { WithRequiredFields } from 'src/types';

export interface DatePickerInputProps {
  endYear?: number;
  hasError?: boolean;
  hideValidationErros?: boolean;
  inputEnabled?: boolean;
  saveLabel?: string;
  startWeekOnMonday?: boolean;
  validRange?: {
    startDate?: Date;
    endDate?: Date;
    disabledDates?: Date[];
  };
}

interface InputDatePickerProps extends WithRequiredFields<FieldBaseProps, 'label'> {
  datePickerInputProps?: DatePickerInputProps;
}

const InputDatePicker = ({
  name,
  label,
  datePickerInputProps
}: InputDatePickerProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField<Date>(name);

  const handleChange = (date: Date | undefined) => {
    if (!date) {
      return;
    }
    void helpers.setTouched(true);
    void helpers.setValue(date);
  };

  return (
    <FieldBase
      label={label}
      name={name}
    >
      <DatePickerInput
        locale="en"
        label={label}
        value={meta.value}
        onChange={handleChange}
        inputMode="start"
        startWeekOnMonday={true}
        {...datePickerInputProps}
      />
    </FieldBase>
  );
};

export default InputDatePicker;
