import React from "react";

interface IProps {
  className?: string | undefined;
  children: React.ReactNode;
}

export const ApBadge: React.FC<IProps> = ({ children, className }) => {
  return (
    <span
      className={`text-xs bg-gray-200 inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold  text-gray-700 rounded-full ${className}`}
    >
      {children}
    </span>
  );
};
