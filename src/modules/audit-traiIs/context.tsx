import React, { useState } from 'react';
import { createContext } from 'react';
import { IAuditLog, IAuditLogFilter } from './model';
import { useAuditLogQuery } from './gql/query';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { mapPageFilter } from '@/helper';

interface IAuditLogState {
  loading: boolean;
  totalRecords: number;
  auditLogs: IAuditLog[];
  filter: IAuditLogFilter;
  setFilter: React.Dispatch<React.SetStateAction<IAuditLogFilter>>;
  fetchAuditLog: (filter: IAuditLogFilter) => Promise<{ data: IAuditLog[] }>;
}

const AuditLogContext = createContext<IAuditLogState | undefined>(undefined);

export const useAuditLogState = () => {
  const context = React.useContext(AuditLogContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const AuditLogContextProvider: React.FC<IProps> = ({ children }) => {
  const auditLogQuery = useAuditLogQuery();
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [filter, setFilter] = useState<IAuditLogFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchAuditLog = async (filter: IAuditLogFilter): Promise<{ data: IAuditLog[] }> => {
    setLoading(true);
    const payload: any = mapPageFilter(filter);
    return auditLogQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.auditLogPage;
        if (data) {
          setAuditLogs(data?.data);
          setTotalRecords(data?.totalRecords);
          return data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuditLogContext.Provider
      value={{
        loading,
        auditLogs,
        totalRecords,
        filter,
        setFilter,
        fetchAuditLog
      }}
    >
      {children}
    </AuditLogContext.Provider>
  );
};
