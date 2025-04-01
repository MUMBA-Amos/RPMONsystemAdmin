import React, { useState } from 'react';
import { createContext } from 'react';
import { IDashboardReport } from './model';
import { useDashboardQuery } from './gql/query';

interface IDashboardReportState {
  loading: boolean;
  dashboardReport: IDashboardReport;
  fetchDashboardReport: () => Promise<{ data: IDashboardReport }>;
}

const DashboardContext = createContext<IDashboardReportState | undefined>(undefined);

export const useDashboardState = () => {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const DashboardContextProvider: React.FC<IProps> = ({ children }) => {
  const dashboardQuery = useDashboardQuery();
  const [dashboardReport, setDashboardReport] = useState<IDashboardReport>();
  const [loading, setLoading] = useState(true);

  const fetchDashboardReport = async (): Promise<{ data: IDashboardReport }> => {
    setLoading(true);
    return dashboardQuery
      .dashboardReportQ()
      .then((res) => {
        const data = res?.data?.dashboardReport;
        if (data) {
          setDashboardReport(data);
          return data;
        }
        return null
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <DashboardContext.Provider
      value={{
        loading,
        fetchDashboardReport,
        dashboardReport,
      } as any}
    >
      {children}
    </DashboardContext.Provider>
  );
};
