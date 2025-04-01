import React from "react";

const style = {
  info: "text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
  success:
    " text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400",
  danger:
    " text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400",
  warning:
    " text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
  dark: " text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
};

interface IProps {
  type: "info" | "success" | "warning" | "dark";
  message: string | React.ReactNode;
}

export const ApAlert: React.FC<IProps> = ({ message, type }) => {
  return (
    <>
      <div className={`p-4 mb-4 text-sm ${style[type]}`} role="alert">
        <span className="font-medium">{type.toUpperCase()} !</span>
        <div className="mt-5">{message}</div>
      </div>
    </>
  );
};
