import React, { useCallback, useState } from 'react';

import { DatePickerModal } from 'react-native-paper-dates';
import { View } from 'react-native';
import { useField } from 'formik';
import { useTheme } from 'react-native-paper';

import FieldBase, { type FieldBaseProps } from './FieldBase';
import Button from '../../components/Button';
import StyledText from '../StyledText';

import type { AppTheme, DateRange } from '../../types';
import { formatDate } from '../../utils/dateTools';

export interface DatePickerModalProps {
  endLabel?: string;
  endYear?: number;
  inputEnabled?: boolean;
  saveLabel?: string;
  startLabel?: string;
  startYear?: number;
  startWeekOnMonday?: boolean;
  validRange?: {
    startDate?: Date;
    endDate?: Date;
    disabledDates?: Date[];
  };
}

interface DateRangeSelectorProps {
  dateRange: Partial<DateRange>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateRangeSelector = ({ dateRange, setIsVisible }: DateRangeSelectorProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View style={theme.styles.containerFlexRow}>
      {dateRange.startDate === undefined || dateRange.endDate === undefined
        ? <Button onPress={() => setIsVisible(true)}>Select dates</Button>
        : <>
            <View style={theme.styles.containerFlexColumn}>
              <StyledText style={{ padding: 8, }}>From:</StyledText>
              <StyledText style={{ padding: 8, }}>To:</StyledText>
            </View>
            <View style={theme.styles.containerFlexColumn}>
              <Button onPress={() => setIsVisible(true)}>{dateRange.startDate ? formatDate(dateRange.startDate) : 'Please select a From date'}</Button>
              <Button onPress={() => setIsVisible(true)}>{dateRange.endDate ? formatDate(dateRange.endDate) : 'Please select an End date'}</Button>
            </View>
          </>
      }
    </View>
  );
};

interface RangeDatePickerProps extends FieldBaseProps {
  datePickerModalProps?: DatePickerModalProps;
}

const RangeDatePicker = ({
  name,
  label,
  datePickerModalProps
}: RangeDatePickerProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_field, meta, helpers] = useField<Partial<DateRange>>(name);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const onDismiss = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const onConfirm = ({ startDate, endDate }: Partial<DateRange>) => {
    setIsVisible(false);
    void helpers.setTouched(true);
    void helpers.setValue({ startDate, endDate });
  };

  return (
    <FieldBase
      label={label}
      name={name}
    >
      <DateRangeSelector dateRange={meta.value} setIsVisible={setIsVisible} />
      <DatePickerModal
        locale="en"
        label={label}
        mode="range"
        visible={isVisible}
        onDismiss={onDismiss}
        startDate={meta.value.startDate}
        endDate={meta.value.endDate}
        startWeekOnMonday={true}
        onConfirm={onConfirm}
        {...datePickerModalProps}
      />

    </FieldBase>
  );
};

export default RangeDatePicker;
