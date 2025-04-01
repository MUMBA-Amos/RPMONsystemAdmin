import { Switch } from "antd";
import { useField } from "formik";
import React, { useEffect, useState } from "react";
import { ApText } from "../typography";

interface IProps {
  label?: string;
  name?: string;
  value?: boolean;
  ignoreFormik?: boolean;
  onChange?: (value?: boolean) => void;
  containerStyle?: string;
  className?: string;
}

export const ApSwitchInput: React.FC<IProps> = (props: IProps) => {
  const { label, onChange, ignoreFormik, value, className  } = props;
  const [val,setVal] = useState<boolean | undefined>(value);

  useEffect(()=>{
    setVal(value);
  },[props])

  if (ignoreFormik)
    return (
      <div className={`flex mb-5 ${props.containerStyle}`}>
        <ApText className="mb-2 mr-3 cus-sm2:text-xs" size="sm">{label}</ApText>
        <Switch
          defaultChecked={value}
          checked={val}
          onChange={(e) => {
            if (onChange) onChange(e);
          }}
          className={className}
        />
      </div>
    );

  return <SwitchInputFormik {...props} />;
};

const SwitchInputFormik: React.FC<IProps> = (props: IProps) => {
  const { label, name, className } = props;

  const [field, meta, { setValue }] = useField(name as any);

  return (
    <div className={`flex mb-5 ${props.containerStyle}`}>
      <span className="mr-3">{label}</span>
      <Switch
        defaultChecked={field?.value}
        onChange={() => {
          setValue(!field.value);
        }}
        className={className}
      />
    </div>
  );
};
