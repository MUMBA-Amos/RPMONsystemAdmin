import { AP_DATE_TIME_FORMAT } from '@/constants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
interface IProps {
  date: number | string;
  duration?: number | string;
  format?: string;
  className?: string;
}

export const ApDateTime: React.FC<IProps> = (props: IProps) => {
  const { date, duration, format, className } = props;
  const [dt, setDt] = useState({} as any);

  useEffect(() => {
    let d: any;
    try {
      d = moment(Number(date));
    } catch (error) {
      d = moment(new Date(date));
    }
    setDt(d.toDate());
  }, [date]);

  if (!date || date === 0) return '-';

  return (
    <Moment
      local
      format={format || AP_DATE_TIME_FORMAT}
      className={className}
      duration={duration}
      date={dt}
    />
  );
};
