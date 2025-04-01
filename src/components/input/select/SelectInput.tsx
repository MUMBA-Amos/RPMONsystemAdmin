import { useField } from 'formik';
import React, { useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { AsyncAdditionalProps } from 'react-select/dist/declarations/src/useAsync';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';
import { ApText } from '../../typography';
import { IProps, styles, theme } from './model';
import { SelectWrapper } from './wrapper';

export const ApSelectInput: React.FC<IProps> = (props) => {
  const {
    label,
    options,
    isMulti,
    name,
    containerClassName,
    onChange,
    height,
    labelKey = 'label',
    valueKey = 'value',
    ignoreFormik,
    inputClassName
  } = props;

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
        options={(options as any)?.sort((a: any, b: any) =>
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
    </SelectWrapper>
  );
};

/**
 * sample usage
 * 
  const promiseOptions = (inputValue: string) =>
    new Promise<ICompany[]>((resolve) => {
      // make resolver requst and add the result to resolve function for the options to be displayed
      findCompany({ name: inputValue }).then((res) => {
        resolve(res);
      });
    });

 * 
 * <ApSelectInputAsync
                    label="Select Company"
                    name={'company'}
                    labelKey="name" // the key to be displayed as label e.g name
                    valueKey="_id" // the key to be used as value e.g _id
                    cacheOptions={false}
                    placeholder={'Select Company'}
                    loadOptions={promiseOptions}
                  />
 * 
 * 
 */
interface IAsyncProps extends StateManagerProps, AsyncAdditionalProps<any, any> {
  label?: string;
  name: string;
  isMulti?: boolean;
  height?: string;
  createable?: boolean;
  ignoreFormik?: boolean;
  inputClassName?: string;
  labelKey?: string;
  valueKey?: string;
  searchPlaceholder?: string | React.ReactNode;
  containerClassName?: string | undefined;
  onChange?: (value: any) => void;
  onCreateOption?: (value: any) => void;
}

export const ApSelectInputAsync: React.FC<IAsyncProps> = (props) => {
  const {
    containerClassName,
    label,
    ignoreFormik,
    name,
    labelKey = 'label',
    valueKey = 'value',
    onChange,
    onCreateOption,
    createable,
    height,
    searchPlaceholder
  } = props as IAsyncProps;

  const [value, setValue] = useState();

  let formikField = ignoreFormik ? null : useField(name);

  const getOptionLabel = (option: any) => {
    return option.__isNew__ ? option.label : option[labelKey || 'label'];
  };

  const getOptionValue = (option: any) => {
    return option.__isNew__ ? option.label : option[valueKey || 'value'];
  };

  const handleChange = (val: any) => {
    if (!ignoreFormik) {
      formikField?.[2].setValue(val);
    }
    setValue(val);
    if (onChange) onChange(val);
  };

  const renderAsyncCreatableSelect = () => {
    return (
      <AsyncCreatableSelect
        {...props}
        name={name}
        value={ignoreFormik ? value : formikField?.[0]?.value}
        noOptionsMessage={() => searchPlaceholder || 'Start typing to search for options'}
        styles={styles({ height })}
        onCreateOption={onCreateOption}
        getOptionLabel={getOptionLabel} // Set the label prop
        getOptionValue={getOptionValue}
        onChange={handleChange}
      />
    );
  };

  const renderAsyncSelect = () => {
    return (
      <AsyncSelect
        {...props}
        name={name}
        value={ignoreFormik ? value : formikField?.[0]?.value}
        placeholder={props.placeholder}
        styles={styles({ height })}
        noOptionsMessage={() => searchPlaceholder || 'Start typing to search for options'}
        getOptionLabel={getOptionLabel} // Set the label prop
        getOptionValue={getOptionValue}
        onChange={handleChange}
        loadOptions={props.loadOptions}
      />
    );
  };

  return (
    <div className={`${containerClassName}`}>
      {label && <ApText size="sm">{label}</ApText>}
      {createable ? renderAsyncCreatableSelect() : renderAsyncSelect()}
    </div>
  );
};
