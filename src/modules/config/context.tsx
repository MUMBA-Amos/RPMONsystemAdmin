import React, { createContext, useState } from "react";
import { toastSvc } from "../../services";
import { useConfigQuery } from "./gql/query";
import { IConfig } from "./model";

interface IConfigState {
  loading: boolean;
  updateLoading: boolean;

  config: IConfig;
  fetchCurrentConfig: () => void;
  updateConfig: (values: any) => Promise<IConfig>;
}
const ConfigContext = createContext<IConfigState>({
  loading: true,
  updateLoading: false,

  config: {} as any,
  fetchCurrentConfig() {},
  updateConfig(values) {
    return null as any;
  },
});

export const useConfigState = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within the app global provider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const ConfigContextProvider: React.FC<IProps> = ({ children }) => {
  const [config, setConfig] = useState<IConfig>({} as any);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const configQ = useConfigQuery();

  const fetchCurrentConfig = () => {
    configQ
      .fetch({
        variables: {},
      })
      .then((res) => {
        const data = res.data?.fetchCurrentConfig;
        if (data) {
          setConfig(data);
        }
      });
  };

  const updateConfig = (values: any) => {
    setUpdateLoading(true);
    return configQ
      .update({
        variables: {
          config: {
            ...values,
          },
        },
      })
      .then((res) => {
        setUpdateLoading(false);
        const data = res.data?.updateConfig;

        if (data) {
          toastSvc.success("Settings Updated");
          setConfig(data);
        }
        return data;
      });
  };

  return (
    <ConfigContext.Provider
      value={{
        loading: loading || updateLoading,
        config,
        fetchCurrentConfig,
        updateLoading,
        updateConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
