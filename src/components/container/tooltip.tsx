import { Tooltip } from "antd";
import { TooltipPropsWithOverlay } from "antd/es/tooltip";
import React from "react";


interface IProps extends TooltipPropsWithOverlay {
  children: React.ReactNode;
}

export const ApTooltip: React.FC<IProps> = (props) => {
  return <Tooltip title {...props}>{props.children}</Tooltip>;
};
