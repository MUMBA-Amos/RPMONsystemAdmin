import { Checkbox, CheckboxProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ErrorMessage, useField } from "formik";
import React from "react";

interface IProps {
  name: string;
  label?: React.ReactNode;
  className?: string;
  ignoreFormik?: boolean;
  onChange?: (val: any) => void;
  props?: {
    [x: string]: any;
  };
}

type ApCheckBoxProps = IProps & CheckboxProps;

export const ApCheckbox: React.FC<ApCheckBoxProps> = (props) => {
  const { label, name, onChange, className } = props;

  if (props?.ignoreFormik)
    return (
      <div className="flex gap-2 items-center">
        <Checkbox
          {...props}
          onChange={(val: CheckboxChangeEvent) => {
            if (onChange) onChange({ name, status: val.target.checked });
          }}
          name={name}
        />

        {label && (
          <div className="text-sm bold">{label}</div>
        )}
      </div>
    );

  return <ApCheckboxFormik {...props} />;
};

const ApCheckboxFormik: React.FC<ApCheckBoxProps> = (props) => {
  const { label, name, onChange, className } = props;
  const [field, meta, { setValue }] = useField(name);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center">
        <Checkbox
          {...props}
          onChange={(val: CheckboxChangeEvent) => {
            if (props.ignoreFormik) setValue(val.target.checked);
            if (onChange) onChange({ name, status: val.target.checked });
          }}
          name={name}
        />

        <div className="text-sm bold">{label}</div>
      </div>

      <ErrorMessage className="text-red-500 mt-1" name={name} component="div" />
    </div>
  );
};
