import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

interface IProps {}

export const ApLoader: React.FC<IProps> = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
        <LoadingOutlined className="text-5xl text-primary" color="#DAA520"/>
    </div>
  );
};

export const ApSignInLoading = () => {
  return (
    <>
      <div className="animate-pulse">
        <div className="flex gap-4 justify-center align-center">
          <div className="w-3 h-3 border rounded-full bg-white"></div>
          <div className="w-3 h-3 border rounded-full bg-white"></div>
          <div className="w-3 h-3 border rounded-full bg-white"></div>
        </div>
      </div>
    </>
  );
};
