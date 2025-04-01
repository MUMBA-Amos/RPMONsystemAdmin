import React from "react";

interface IProps {
  title: string | React.ReactNode;
  className?: string | undefined;
}

export const ApPageTitle: React.FC<IProps> = ({ title, className }) => {
  return (
    <div className="flex items-start justify-between">
      <h1
        className={`text-xl cus-sm2:text-xl cus-xs:!text-xl font-semibold ${className}`}
      >
        {title}
      </h1>
    </div>
  );
};
