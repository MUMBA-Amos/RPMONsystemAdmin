import React from 'react';
import Image from 'next/image';
// import logo from '../../assets/ms-bullion-logo.png';
import moment from 'moment';

interface IProps {
  reportType: React.ReactNode | string;
  fromDate: number | Date | undefined;
  toDate: number | Date | undefined;
  children: React.ReactNode;
  containerClassName?: string;
}

export const TemplateLayout: React.FC<IProps> = ({
  children,
  reportType,
  fromDate,
  toDate,
  containerClassName = 'templay-layout'
}) => {
  return (
    <div className={`p-4 ${containerClassName}`}>
      <header className="flex justify-between">

      </header>

      <div className='flex items-center mb-5 flex-col'>
        {typeof reportType === "string" ?
          <h1 className="text-2xl text-center font-semibold uppercase">{reportType} Report</h1> : reportType}

        <div className="flex gap-5 flex-row">
          {fromDate ? <h6>From: {moment(fromDate).format('L')}</h6> : null}
          {fromDate && toDate ? "-" : null}
          {toDate ? <h6>To: {moment(toDate).format('L')}</h6> : null}
        </div>
      </div>
      {children}
    </div>
  );
};
