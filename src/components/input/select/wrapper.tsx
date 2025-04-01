import React from 'react';
import { IProps } from './model';
import { ApText } from '@/components/typography';

interface IWrapperProps extends IProps {
  formikField: any;
  children: React.ReactNode;
}

export const SelectWrapper: React.FC<IWrapperProps> = (props: IWrapperProps) => {
  const { label, children, formikField, containerClassName, ignoreFormik } = props;

  return (
    <div className={`${containerClassName}`}>
      {label && <p className="cus-sm2:text-xs text-sm">{label}</p>}
      {children}
      {!ignoreFormik
        ? formikField?.[1].error && (
          <div className="text-red-500">{(formikField?.[1].error as any)?.value}</div>
        )
        : null}
    </div>
  );
};
