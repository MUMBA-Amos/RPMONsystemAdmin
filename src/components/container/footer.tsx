import React from "react";

interface IProps {
  children: React.ReactNode;
  className?: string | undefined;
}

export const ApPageFooter: React.FC<IProps> = ({ children, className }) => {
  return (
    <div
      className={`fixed border left-[20%] 3xl:left-[18%] w-[80%] 3xl:w-[82%] cus-md2:left-0 cus-md2:w-full py-3 px-[25px] bg-white shadow-2xl bottom-0 flex items-center justify-end gap-4 ${className}`}
    >
      {children}
    </div>
  );
};
