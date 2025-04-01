import React from "react";

interface IProps {
  children: React.ReactNode;
  className?: string | undefined;
}

export const ApContainer: React.FC<IProps> = ({ children, className }) => {
  return (
    <div className={`ap-container border rounded-sm p-5 pt-3 cus-sm2:p-3 ${className}`}>
      {children}
    </div>
  );
};
