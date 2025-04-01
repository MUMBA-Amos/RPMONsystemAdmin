import { ApolloProvider } from "@apollo/client";
import React from "react";
import apolloClient from "./ApolloClient";
import { AppContextProvider } from "./Context";
interface IProps {
  children: any;
}

const ApProvider: React.FC<IProps> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient as any}>
      <AppContextProvider>{children}</AppContextProvider>
    </ApolloProvider>
  );
};

export default ApProvider;
