import React, { useEffect, useState } from 'react';
import { createConfirmation } from 'react-confirm';
// import { ApFullModal } from "./modal";

interface IProps {
  title?: string;
  message: string;
  children?: React.ReactNode;
  callback: (val: boolean) => void;
}

const ApDialog: React.FC<IProps> = ({ title, message, children, callback }) => {
  const [show, setShow] = useState({ show: true, timestamp: 0 });

  useEffect(() => {
    setShow({ show: true, timestamp: Date.now() });
  }, []);

  return (
    <>
      {show.show && (
        <div
          className="fixed h-screen w-screen top-0 left-0 bottom-0 flex items-center justify-center"
          style={{ background: '#403c3c75', zIndex: 9999 }}
        >
          <div className="bg-white rounded-md w-full max-w-[600px] h-fit mt-4">
            <div className="bg-primary rounded-t px-5 py-3 flex justify-between items-center">
              <p className="text-white font-bold text-lg">{title || 'Confirm!'}</p>
              {/* <MdOutlineCancel /> */}

              <p
                className="text-white cursor-pointer"
                onClick={() => {
                  callback(false);
                  setShow({ show: false, timestamp: Date.now() });
                }}
              >
                X
              </p>
            </div>
            <div className="modal-body text-left py-4 px-5 leading-loose">
              <p>{message || `Are you sure you want to perform this actions ?`}</p>
              {children}
            </div>
            <div className="flex justify-end px-8 pb-5 mt-5 gap-3">
              <button
                type="button"
                className="rounded-md py-2 px-8 bg-transparent border border-primary text-primary"
                onClick={() => {
                  callback(false);
                  setShow({ show: false, timestamp: Date.now() });
                }}
              >
                NO
              </button>

              <button
                type="button"
                className="rounded-md py-2 px-8 bg-primary text-white"
                onClick={() => {
                  callback(true);
                  setShow({ show: false, timestamp: Date.now() });
                }}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ApConfirm = createConfirmation(ApDialog as any) as (dialog: IProps) => void;
