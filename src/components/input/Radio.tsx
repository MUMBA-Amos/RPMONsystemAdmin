import { ErrorMessage, Field, FieldProps, useField } from 'formik';
import React, { useEffect } from 'react';

interface IProps {
  label?: string;
  name: string;
  value?: string;
  checked?: boolean;
  ignoreFormik?: boolean;
  containerClassName?: string | undefined;
  inputClassName?: string | undefined;
  onChange?: (value: string) => void;
}

export const ApRadio: React.FC<IProps> = (props: IProps) => {
  const {
    label,
    name,
    value,
    checked,
    ignoreFormik,
    containerClassName,
    inputClassName,
    onChange
  } = props;

  let formikField: any = null;
  if (name && !ignoreFormik) {
    formikField = useField(name);
  }

  const handleSetValues = (val: string) => {
    if (!ignoreFormik) {
      formikField?.[2].setValue(val);
    }
    onChange && onChange(val);
  };

  const renderInput = (fieldProps?: FieldProps<any>) => {
    const field = fieldProps?.field;
    const meta = fieldProps?.meta;

    return (
      <>
        <div className="flex">
          <input
            className={inputClassName}
            type="radio"
            name={name}
            checked={checked}
            {...formikField}
            value={value}
            onChange={(event: any) => {
              handleSetValues(event.target.value);
            }}
          />
          <label
            role="button"
            className="cus-sm2:text-xs font-semibold text-sm ml-3"
            onClick={() => {
              handleSetValues(value as string);
            }}
          >
            {label}
          </label>
        </div>
        {meta?.touched && meta?.error && <div className="text-red-500">{meta.error}</div>}
      </>
    );
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {ignoreFormik ? (
        renderInput()
      ) : (
        <>
          <Field name={name}>{(fieldProps: FieldProps<any>) => renderInput(fieldProps)}</Field>
        </>
      )}
    </div>
  );
};
