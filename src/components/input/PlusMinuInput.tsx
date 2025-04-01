import { ErrorMessage, useField } from "formik";
import React, { useEffect, useState } from "react";
import { ApButton } from "../button";
import { ApTextInput } from "./TextInput";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

interface IProps {
  name?: string;
  label?: string;
  defaultValue?: number;
  inputClassName?: string;
  btnClassName?: string;
  ignoreFormik?: boolean;
  onChange?: (value: number) => void;
}

export const ApPlusMinusInput: React.FC<IProps> = (props) => {
  const {
    label,
    name,
    defaultValue,
    btnClassName,
    inputClassName,
    onChange,
    ignoreFormik,
  } = props;
  const [value, setValue] = useState<number | undefined>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  let formikField: any = null;
  if (name && !ignoreFormik && ignoreFormik !== undefined) {
    formikField = useField(name);
  }

  useEffect(() => {
    if (onChange && value) onChange(value);
  }, [value]);

  const handleIncrease = () => {
    if (!ignoreFormik) {
      let val = formikField?.[0]?.value;
      formikField?.[2].setValue(++val);
    }
    setValue((value || 0) + 1);
  };

  const handleDecrease = () => {
    if (!ignoreFormik) {
      let val = formikField?.[0]?.value;
      if (val && val > 1) {
        formikField?.[2].setValue(--val);
      }
    }
    if (value && value > 1) {
      setValue(value - 1);
    }
  };

  return (
    <div className="mb-5">
      <label className="label block mb-2" htmlFor="email">
        {label}
      </label>

      <div className="flex ">
        <FaCircleMinus
          className={`text-primary w-10 h-10 text-xl cursor-pointer ${btnClassName}`}
          onClick={handleDecrease}
        />
        <ApTextInput
          className={`w-20 h-7 text-center rounded-sm p-0 relative  bg-white font-extrabold ${inputClassName}`}
          name={`${name}`}
          type="number"
          ignoreFormik={ignoreFormik}
          {...(ignoreFormik
            ? {
                value: `${value || 0}`,
                onChange: (val:any) => {
                  setValue(+val?.currentTarget?.value);
                },
              }
            : {
                onChange: (val:any) => {
                  formikField?.[2].setValue(+val?.currentTarget?.value);
                  onChange && onChange(+val?.currentTarget?.value);
                },
              })}
        />
        <FaCirclePlus
          className={`text-primary w-10 h-10 text-xl cursor-pointer ${btnClassName}`}
          onClick={handleIncrease}
        />
      </div>

      {!ignoreFormik && (
        <ErrorMessage className="danger" name={`${name}`} component="div" />
      )}
    </div>
  );
};
