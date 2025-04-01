import { Tabs, TabsProps } from 'antd';
import React from 'react';

interface IProps extends TabsProps {}

export const ApTabs: React.FC<IProps> = (props) => {
  return <Tabs {...props} />;
};
