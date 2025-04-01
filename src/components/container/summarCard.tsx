import React from 'react';
import SummaryImage from '../../assets/summary-card.svg';
import { ApImage } from '../image';
import SummaryCardSvg from '@/assets/svg/summary-card';

interface IProps {
  value?: React.ReactNode | number | string;
  title: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string | undefined;
}

export const ApSummaryCard: React.FC<IProps> = ({ value, title, subTitle, className, icon }) => {
  return (
    <div
      className={`relative px-2 pt-1 pb-5 bg-transparent border rounded-lg cus-xs:p-3 bg-stone-100 ${className} overflow-hidden w-full`}
    >
      <div className="absolute w-full left-1 bottom-2">
        <SummaryCardSvg />
      </div>

      <div className="relative z-10">
        <h3 className="mb-5 text-sm">{title}</h3>
        <div className="mb-3 text-center">
          <h2 className="mb-2 text-2xl text-primary">{value}</h2>
          {subTitle && typeof subTitle === 'string' ? (
            <h3 className="text-base font-light text-alt-dark">{subTitle}</h3>
          ) : (
            subTitle
          )}
        </div>
      </div>
    </div>
  );
};

interface IContainerProps {
  children: React.ReactNode;
  className?: string | undefined;
}

export const ApSummaryContainer: React.FC<IContainerProps> = ({ children, className }) => {
  return <div className={`flex gap-5 w-full ${className}`}>{children}</div>;
};
