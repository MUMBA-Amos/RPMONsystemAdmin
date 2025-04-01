import React from "react";
import { ApText } from "../typography";

interface IProps {
  label: string;
  value: number | string | React.ReactNode | undefined;
  className?: string;
  labelColor?: "default" | "muted" | "white" | "gold" | "primary";
  font?: "bold" | "normal" | "semibold";
  prefix?: React.ReactNode;
}

export const ApLabelInput: React.FC<IProps> = ({
  label,
  value,
  className,
  labelColor,
  font,
  prefix,
}) => {
  return (
    <div>
      <ApText color={labelColor}>{label}</ApText>
      <div
        className={`${className} border flex justify-between items-center bg-stone-200 p-3 rounded-md`}
      >
        <ApText font={font}>
          {value !== "null" && value !== "undefined" ? value : "-"}
        </ApText>
        {prefix}
      </div>
    </div>
  );
};
