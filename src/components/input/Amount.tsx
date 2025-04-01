import { ErrorMessage, Field, FieldProps, useField } from 'formik';
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

interface IProps {
  name?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  ignoreFormik?: boolean;
  sufix?: React.ReactNode;
  prefix?: React.ReactNode;
  containerClassName?: string | undefined;
  onChange?: (value: string) => void;
}

export const ApAmountInput: React.FC<IProps> = (props) => {
  const {
    label,
    name,
    sufix,
    prefix = 'RM',
    disabled,
    onChange,
    placeholder,
    ignoreFormik,
    inputClassName,
    containerClassName
  } = props;
  const [value, setValue] = useState<string | undefined>(props?.value);

  let formikField: any = null;

  if (name && !ignoreFormik) {
    formikField = useField(name);
  }

  const handleUpdateValue = (value: string) => {
    setValue(value === undefined ? '' : value);
    if (!ignoreFormik) {
      formikField?.[2].setValue(value);
    }
    onChange && onChange(value || '');
  };

  const renderCurrencyInput = (fieldProps?: FieldProps<any>) => {
    const field = fieldProps?.field;

    if (field && !field.value && formikField?.[1].initialValue) {
      formikField?.[2].setValue(formikField?.[1].initialValue);
    }

    return (
      <CurrencyInput
        id={`id-${name}`}
        name={name}
        disabled={disabled}
        className={`text-left p-0 relative border px-3 rounded-sm text-[13px] outline-none w-full h-[45px]
          focus:border-gray-400 focus:h-[45px] ${inputClassName}`}
        placeholder={placeholder || 'Amount'}
        value={formikField?.[1].value || value || 0}
        autoComplete="off"
        decimalsLimit={2}
        onValueChange={(value, name, values) => {
          handleUpdateValue(value as string);
        }}
        autoSave="off"
      />
    );
  };

  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block label font-light" htmlFor={`id-${name}`}>
          {label}
        </label>
      )}
      <div className="flex items-center w-full">
        {prefix && (
          <h1 className="px-3 py-3 mr-1 text-sm font-normal border rounded-sm">{prefix}</h1>
        )}

        {ignoreFormik ? (
          renderCurrencyInput()
        ) : (
          <Field name={name}>
            {(fieldProps: FieldProps<any>) => renderCurrencyInput(fieldProps)}
          </Field>
        )}

        {sufix}
      </div>

      {!ignoreFormik && (
        <ErrorMessage className="text-sm text-red-500" name={`${name}`} component="div" />
      )}
    </div>
  );
};
