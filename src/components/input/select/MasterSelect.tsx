import { useMasterState } from '@/modules/master/context';
import { useField } from 'formik';
import React, { useState } from 'react';
import Select from 'react-select';
import { IProps, styles, theme } from './model';
import { SelectWrapper } from './wrapper';

export interface IMasterProps extends IProps {
  name: string;
  masterKey: string;
}

export const ApMasterSelectInput: React.FC<IMasterProps> = (props) => {
  const {
    isMulti,
    name,
    masterKey,
    height,
    labelKey = 'label',
    valueKey = 'value',
    ignoreFormik,
    inputClassName,
    onChange,
    helperText
  } = props;

  const { getMasterByKey } = useMasterState();

  let formikField = ignoreFormik ? null : useField(name);

  const [value, setValue] = useState();

  const getOptionLabel = (option: any) => {
    return option.__isNew__ ? option.label : option[labelKey || 'label'];
  };
  const getOptionValue = (option: any) => {
    return option.__isNew__ ? option.label : option[valueKey || 'value'];
  };

  return (
    <SelectWrapper {...props} formikField={formikField}>
      <Select
        {...props}
        isMulti={isMulti}
        options={getMasterByKey(masterKey)?.children?.sort((a: any, b: any) =>
          a[labelKey]?.toLowerCase()?.localeCompare(b[labelKey]?.toLowerCase())
        )}
        name={name}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        value={value || formikField?.[0]?.value}
        theme={theme}
        styles={styles({ height })}
        className={`${height || 'h-[45px]'} ${inputClassName}`}
        onChange={(val: any) => {
          if (!ignoreFormik) {
            formikField?.[2].setValue(val);
          }
          setValue(val);
          if (onChange) onChange(val);
        }}
      />
      <p className="text-sm text-gray-400 pt-1">{helperText}</p>
    </SelectWrapper>
  );
};
