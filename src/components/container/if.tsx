import React from "react";

interface IProps {
  condition: boolean | any;
  children: React.ReactNode;
  elseChildren?: React.ReactNode;
  className?: string | undefined;
}

export const ApIf: React.FC<IProps> = ({
  condition,
  children,
  elseChildren,
  className,
}) => {
  if (!className) {
    return <>{condition ? children : elseChildren}</>;
  }

  return <div className={className}>{condition ? children : elseChildren}</div>;
};
