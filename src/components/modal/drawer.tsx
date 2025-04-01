import React from "react";
import { Drawer } from "antd";

interface IProps {
  title?: string | React.ReactNode;
  show: boolean;
  maskClosable?: boolean;
  width?: number | string;
  possition?: "left" | "right";
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
  onDimiss?: () => void;
}

export const ApDrawalModal: React.FC<IProps> = (props: IProps) => {
  const {
    title,
    show,
    children,
    maskClosable,
    headerChildren,
    width,
    onDimiss,
  } = props;
  return (
    <Drawer
      title={title}
      width={width || 720}
      onClose={onDimiss}
      open={show}
      bodyStyle={{ paddingBottom: 80 }}
      extra={headerChildren}
      maskClosable={maskClosable || false}
    >
      {children}
    </Drawer>
  );
};
