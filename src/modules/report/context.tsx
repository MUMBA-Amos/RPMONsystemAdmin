import { IModal } from '@/components';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { mapPageFilter } from '@/helper';
import React, { createContext, useState } from 'react';
import { useActivityState } from '../activity/context';
import { useReportQuery } from './gql/query';
import { ICreateReportInput, IReport, IReportFilter } from './model';

type ModalTypes = 'create' | 'update' | 'extension';
interface IReportState {
  loading: boolean;
  updating: boolean;
  totalRecords: number;
  reports: IReport[];
  finalReport: IReport | undefined;
  filter: IReportFilter;
  setFilter: React.Dispatch<React.SetStateAction<IReportFilter>>;
  setFinalReport: React.Dispatch<React.SetStateAction<IReport | undefined>>;
  modal: IModal<ModalTypes>;
  setModal: React.Dispatch<React.SetStateAction<IModal<ModalTypes>>>;
  deleteReport: (_id: string) => Promise<Boolean>;
  fetchReport: (filter: IReportFilter, noLoading?: boolean) => Promise<{ data: IReport[] }>;
  saveReport: (_id: string, payload: IReport) => Promise<IReport | null>;
  startFinalReport: (report: ICreateReportInput) => Promise<IReport>;
  findFinalReport: (applicationId: string) => Promise<IReport | undefined>;
}

const ReportContext = createContext<IReportState | undefined>(undefined);

export const useReportState = () => {
  const context = React.useContext(ReportContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const ReportContextProvider: React.FC<IProps> = ({ children }) => {
  const reportQuery = useReportQuery();
  const [reports, setReports] = useState<IReport[]>([]);
  const [filter, setFilter] = useState<IReportFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [modal, setModal] = useState<IModal<ModalTypes>>({ show: false });
  const [loading, setLoading] = useState(false);
  const [finalReport, setFinalReport] = useState<IReport | undefined>();
  const [updating, setUpdating] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const { formatActivities } = useActivityState();

  const fetchReport = async (
    filter: IReportFilter,
    noLoading?: boolean
  ): Promise<{ data: IReport[] }> => {
    !noLoading && setLoading(true);
    const payload: any = mapPageFilter(filter);
    return reportQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.reportPage;
        if (data) {
          setReports(
            data?.data?.map((item: any) => ({
              ...item,
              activities: item?.activities ? formatActivities(item?.activities) : item?.activities
            }))
          );
          setTotalRecords(data?.totalRecords);
          return data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startFinalReport = async (report: ICreateReportInput) => {
    const payload = {
      applicationId: report?.applicationId,
      title: report?.title,
      description: report?.description
    };
    return await reportQuery
      .startFinalReport({
        variables: {
          report: {
            ...payload
          }
        }
      })
      .then((res) => {
        const data = res?.data?.startFinalReport;
        if (data) {
          setFinalReport(data.data);
          findFinalReport(report?.applicationId);
        }
        return data;
      });
  };
  
  const findFinalReport = async (applicationId: string) => {
    return reportQuery
      .findFinalReport({
        variables: {
          report: {
            applicationId
          }
        }
      })
      .then((res) => {
        const data = res?.data?.findFinalReport;
        if (data) {
          setFinalReport({ ...data, ...finalReport });
        }
        return data;
      });
  };
  const createReport = async (payload: Partial<IReport>): Promise<IReport | null> => {
    setUpdating(true);
    return reportQuery
      .create({ variables: { report: payload } })
      .then((res) => {
        const data: IReport = res?.data?.createReport;
        if (data) {
          setReports([data, ...reports]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateReport = async (_id: string, payload: Partial<IReport>): Promise<IReport> => {
    return reportQuery
      .update({ variables: { _id, report: payload } })
      .then((res) => {
        const data: IReport = res?.data?.updateReport;
        if (data) {
          setReports(reports.map((report) => (report._id === _id ? data : report)));
          return data;
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveReport = async (_id: string, payload: Partial<IReport>): Promise<IReport | null> => {
    if (_id) return updateReport(_id, payload);

    return createReport(payload);
  };

  const deleteReport = async (_id: string): Promise<boolean> => {
    setLoading(true);
    return reportQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IReport = res?.data?.deleteReport;
        if (data) {
          setReports(reports.filter((report) => report._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ReportContext.Provider
      value={{
        loading,
        updating,
        reports,
        totalRecords,
        modal,
        setModal,
        filter,
        setFilter,
        fetchReport,
        saveReport,
        deleteReport,
        finalReport,
        startFinalReport,
        findFinalReport,
        setFinalReport
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
