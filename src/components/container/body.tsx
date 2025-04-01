import React from 'react';

interface IProps {
  children: React.ReactNode;
  className?: string | undefined;
}

export const ApBodyContainer: React.FC<IProps> = ({ children, className }) => {
  return (
    <div className={`ap-body-container pt-[20px] px-5 space-y-4 ${className}`}>{children}</div>
  );
};
