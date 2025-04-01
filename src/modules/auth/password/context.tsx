import React, { createContext, useState } from "react";
import { usePasswordQuery } from "./gql/query";
import { toastSvc } from "../../../services";
import { useRouter } from "next/router";

interface IPasswordState {
  loading: boolean;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const PasswordContext = createContext<IPasswordState>({
  loading: false,
  forgotPassword(email) {
    return Promise.resolve();
  },
  changePassword(oldPassword, newPassword) {
    return Promise.resolve()
  },
});

export const usePasswordState = () => {
  const context = React.useContext(PasswordContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within the app global provider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const PasswordContextProvider: React.FC<IProps> = ({ children }) => {
  const PasswordQ = usePasswordQuery();
  const router = useRouter();

  const forgotPassword = async (email: string): Promise<void> => {
    return PasswordQ.forgetPassword[0]({ variables: { email: email } })
      .then((res) => {
        const data = res?.data?.forgotPassword;
        if (data) {
          toastSvc.success(data);
          router.push("/login");
        }
      })
     
  };

  const changePassword = async (
    oldPassword: string, 
    newPassword: string
  ): Promise<void> => {
    return PasswordQ.changePassword[0]({
      variables: { password: { oldPassword, newPassword } },
    })
      .then((res) => {
        const data = res?.data?.changePassword;
        if (data) {
          toastSvc.success(data);
          router.push("/login");
        }
        return data
      })

  };

  return (
    <PasswordContext.Provider value={{ loading:PasswordQ.loading, forgotPassword, changePassword }}>
      {children}
    </PasswordContext.Provider>
  );
};
