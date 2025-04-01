import React, { useState, useEffect } from 'react';
import { Field, FieldProps, useField } from 'formik';
import { DatePicker, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { AP_CALENDAR_DATE_FORMAT, AP_TIME_FORMAT } from '@/constants';

interface IProps {
  name: string;
  ignoreFormik?: boolean;
  maxDate?: string | number;
  label?: string | React.ReactNode;
  onChange?: (date: string | number | any) => void;
  containerClassName?: string | undefined;
}

type ApDateInputProps = IProps & DatePickerProps;

const ApDateInput: React.FC<ApDateInputProps> = ({
  name,
  label,
  value,
  maxDate,
  ignoreFormik,
  containerClassName,
  onChange,
  ...datePickerProps
}) => {
  let formikField: any = null;
  if (name && !ignoreFormik) {
    formikField = useField(name);
  }

  const [initialValue, setInitialValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (formikField && formikField[0].value) {
      setInitialValue(dayjs(+formikField[0].value));
      formikField[2].setValue(+formikField[0].value);
    } else if (value) {
      setInitialValue(dayjs(value));
    }
  }, []);

  const renderDatePicker = (fieldProps?: FieldProps<any>) => {
    const field = fieldProps?.field;
    const meta = fieldProps?.meta;

    return (
      <div className="w-full">
        <DatePicker
          showTime={{
            format: AP_TIME_FORMAT,
            use12Hours: true
          }}
          {...field}
          {...(datePickerProps as any)}
          value={initialValue}
          onChange={(value: Dayjs | null) => {
            const timestamp = value ? value.valueOf() : null;
            if (!ignoreFormik) {
              formikField?.[2].setValue(timestamp);
            }
            setInitialValue(value);
            onChange && onChange(timestamp);
          }}
          name={name}
          className="!h-[45px] !w-full rounded-sm"
          format={AP_CALENDAR_DATE_FORMAT}
        />
        {meta?.touched && meta?.error && <div className="text-red-500">{meta.error}</div>}
      </div>
    );
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <p className="font-light">{label}</p>}
      {ignoreFormik ? (
        renderDatePicker()
      ) : (
        <Field name={name}>{(fieldProps: FieldProps<any>) => renderDatePicker(fieldProps)}</Field>
      )}
    </div>
  );
};

export default ApDateInput;

export const ApDateInputDisabledDates = {
  greaterThanToday: (current: Dayjs) => {
    // Disable dates after today
    return current && current > dayjs().endOf('day');
  },
  lessThanToday: (current: Dayjs) => {
    // Disable dates after today
    return current && current < dayjs().endOf('day');
  }
};
