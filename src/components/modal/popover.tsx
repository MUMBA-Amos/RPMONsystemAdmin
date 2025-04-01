import { Popconfirm, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

interface IProps {
  title: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export const ApConfirmPopover: React.FC<IProps> = ({ title, onConfirm, children }) => {
  return (
    <Popconfirm
      okButtonProps={{ className: 'bg-primary' }}
      placement="top"
      title={title}
      onConfirm={() => {
        onConfirm();
      }}
      okText="Yes"
      cancelText="No"
    >
      {children}
    </Popconfirm>
  );
};

export interface IApPopOverRef {
  toggle: () => void;
}

interface IProps2 {
  title?: React.ReactNode;
  content?: React.ReactNode;
  ref?: React.Ref<IApPopOverRef | undefined>;
  children?: React.ReactNode;
  className?: string | undefined;
  rootClassName?: string | undefined;
  overlayClassName?: string | undefined;
}

export const ApPopover: React.FC<IProps2> = forwardRef(
  ({ title, children, content, className, overlayClassName, rootClassName }, ref) => {
    const [open, setOpen] = useState(false);

    // Expose the doSomething method to the parent component
    useImperativeHandle(ref, () => ({
      toggle
    }));

    const toggle = () => {
      setOpen(!open);
    };

    return (
      <Popover
        placement="top"
        title={title}
        content={content}
        open={open}
        className={className}
        rootClassName={rootClassName}
        overlayClassName={overlayClassName} // Apply the custom class
      >
        {children}
      </Popover>
    );
  }
);
