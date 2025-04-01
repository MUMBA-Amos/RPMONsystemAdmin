import React, { useRef, useState, useEffect } from 'react';
import _ from 'underscore';
import { ApText } from '../typography';
import { CiSearch } from 'react-icons/ci';

interface IProps {
  placeholder?: string;
  inputClassName?: string;
  containerClassName?: string;
  debounce?: number;
  label?: string;
  value?: string;
  onSearchChange: (value: string | undefined) => void;
  onKeyPress?: (e: any) => void;
}

export const ApSearchInput: React.FC<IProps> = (props: IProps) => {
  const {
    placeholder,
    debounce,
    containerClassName,
    inputClassName,
    onSearchChange,
    onKeyPress,
    label,
    value
  } = props;
  
  const [val, setVal] = useState<string | undefined>(value);

  useEffect(() => {
    if (val === undefined) return;

    if (debounce === 0) {
      onSearchChange(val.toLowerCase());
      return;
    }

    const timeout = setTimeout(() => {
      onSearchChange(val.toLowerCase());
    }, debounce || 1200);

    return () => {
      clearTimeout(timeout);
    };
  }, [val, debounce]);

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <ApText size='sm'>{label}</ApText>}
      <div className="relative">
        <CiSearch className="absolute top-[11px] left-3 text-xl" />
        <input
          type="text"
          value={val}
          placeholder={placeholder}
          className={`pl-10 border px-5 text-[13px] outline-none w-full h-[45px] focus:border-gray-400 rounded-sm ${inputClassName}`}
          onChange={(e) => setVal(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
};