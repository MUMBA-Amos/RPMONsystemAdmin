import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

interface IProps extends TabsProps {}

export const ApTabs: React.FC<IProps> = (props: IProps) => {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={props.items}
        onChange={props.onChange}
        {...props}
      />
    </>
  );
};
