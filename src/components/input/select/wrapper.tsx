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
      {label && <ApText size="sm">{label}</ApText>}
      {children}
      {!ignoreFormik
        ? formikField?.[1].error && (
          <div className="text-red-500">{(formikField?.[1].error as any)?.value}</div>
        )
        : null}
    </div>
  );
};
