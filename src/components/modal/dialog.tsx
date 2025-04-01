import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { createConfirmation } from 'react-confirm';
// import { ApFullModal } from "./modal";

interface IProps {
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  content: React.ReactNode;
  ref?: React.Ref<{ toggle: () => void } | undefined>;
}

const type_class = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  default: 'bg-primary'
};

const Dialog: React.FC<IProps> = forwardRef(({ title, type = 'default', content }, ref) => {
  const [show, setShow] = useState({ show: true, timestamp: 0 });
  useEffect(() => {
    setShow({ show: true, timestamp: Date.now() });
  }, []);

  // Expose the doSomething method to the parent component
  useImperativeHandle(ref, () => ({
    toggle
  }));

  const toggle = () => {
    setShow({ show: !show.show, timestamp: Date.now() });
  };

  return (
    <>
      {show.show && (
        <div
          className="fixed h-screen w-screen top-0 left-0 bottom-0 flex items-center justify-center"
          style={{ background: '#403c3c75', zIndex: 9999 }}
        >
          <div className="bg-white rounded-md w-full max-w-[600px] h-fit mt-4">
            <div
              className={`${type_class[type]} rounded-t px-3 py-3 flex justify-between items-center`}
            >
              <p className="text-white font-bold text-lg">{title || 'Confirm!'}</p>
              <p
                className="text-white cursor-pointer"
                onClick={() => {
                  setShow({ show: false, timestamp: Date.now() });
                }}
              >
                X
              </p>
            </div>
            <div className="px-3 mb-3">{content}</div>
          </div>
        </div>
      )}
    </>
  );
});

export const ApDialog = createConfirmation(Dialog as any, 100) as (dialog: IProps) => void;
