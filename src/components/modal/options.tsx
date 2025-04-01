import React from 'react';

interface ApPopOptionProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ApPopOption: React.FC<ApPopOptionProps> = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors z-50 ${
        open ? 'bg-black/20 visible' : 'invisible'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white py-4 px-5 rounded-lg transition-all${
          open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
