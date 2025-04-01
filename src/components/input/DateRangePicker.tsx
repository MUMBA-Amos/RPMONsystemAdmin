import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import { ApText } from '../typography';
import dayjs from 'dayjs';
import { AP_CALENDAR_DATE_FORMAT } from '@/constants';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface IProps {
  date: {
    fromDate?: number | Date | null;
    toDate?: number | Date | null;
  };
  disabled?: boolean;
  fromLabel?: string;
  toLabel?: string;
  format?: string;
  onChange: (date: { fromDate: number | null; toDate: number | null }) => void;
  containerClassName?: string;
}

export const ApDateRangePicker: React.FC<IProps> = ({
  date,
  fromLabel,
  toLabel,
  format,
  disabled,
  onChange,
  containerClassName
}) => {
  const pickerRef = useRef<any>();

  const onDateChange = (dates: dayjs.Dayjs[] | any, dateStrings: any) => {
    if (onChange) {
      onChange({
        fromDate: dates ? moment(dates[0].valueOf()).startOf('day').valueOf() : null,
        toDate: dates ? moment(dates[1].valueOf()).endOf('day').valueOf() : null
      })
    }
  };

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {(fromLabel || toLabel) && (
        <div className="flex justify-between">
          {fromLabel && (
            <div className="w-[50%]">
              <ApText className="cus-sm2:text-xs" size="sm">
                From Date
              </ApText>
            </div>
          )}
          {toLabel && (
            <div className="w-[50%]">
              <ApText className="cus-sm2:text-xs" size="sm">
                To Date
              </ApText>
            </div>
          )}
        </div>
      )}
      <RangePicker
        disabled={disabled}
        format={format || AP_CALENDAR_DATE_FORMAT}
        className="mt-1 h-11 rounded-sm cus-sm2:h-[40px] cus-sm2:text-xs"
        value={date?.fromDate && date?.toDate ? [dayjs(date?.fromDate), dayjs(date?.toDate)] : null}
        ref={pickerRef}
        onChange={onDateChange}
      />
    </div>
  );
};
