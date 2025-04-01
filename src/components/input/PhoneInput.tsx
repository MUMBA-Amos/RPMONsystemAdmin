import React from 'react';

import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { useField } from 'formik';

interface IProps extends PhoneInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  className?: string;
  containerClassName?: string;
}

export const ApPhoneInput: React.FC<IProps> = ({
  label,
  name,
  placeholder,
  value,
  className,
  containerClassName,
  ...props
}) => {
  const [field, meta, { setValue }] = useField(name);

  return (
    <div className={containerClassName}>
      {label && <p className="cus-sm2:text-xs font-light">{label}</p>}
      <PhoneInput
        buttonStyle={
          {
            // borderTopLeftRadius: 200,
            // borderBottomLeftRadius: 200,
          }
        }
        inputStyle={{
          height: 45,
          backgroundColor: `white`,
          borderWidth: 0,
          width: '100%'
        }}
        containerStyle={{
          // borderRadius: 200,
          borderColor: 'red'
        }}
        inputClass={`${
          className ||
          '!border !bg-transparent px-3 text-[13px] outline-none w-full h-[45px] rounded-md focus:border-gray-100'
        }`}
        value={field.value}
        country={'ng'}
        onChange={(text) => {
          setValue(text);
        }}
        {...props}
      />
      <>{meta?.touched && meta.error && <div className="text-red-500">{meta.error}</div>}</>
    </div>
  );
};
