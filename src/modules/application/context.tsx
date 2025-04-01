import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useApplicationQuery } from './gql/query';
import type { IApplication, IApplicationFilter, IApplicationPayload, IApplicationStatusUpdate } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';
import { toastSvc } from '@/services';

interface IApplicationState {
  loading: boolean;
  updating: boolean;
  applications: IApplication[];
  application: IApplication;
  totalRecords: number;
  filter: IApplicationFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IApplicationFilter>>;
  fetchApplications: (page: IApplicationFilter) => Promise<IApplication[]>;
  saveApplication: (payload: IApplicationPayload, _id?: string) => Promise<IApplication | null>;
  removeApplication: (_id: string) => Promise<boolean>;
  createApplication: (payload: IApplicationPayload) => Promise<IApplication | null>
  fetchApplication: (id: string) => Promise<IApplication>
  setApplication: (application: IApplication) => void;
  updateStatus: (status: IApplicationStatusUpdate) => Promise<IApplication>
}

const ApplicationContext = createContext<IApplicationState | undefined>(undefined);

export const useApplicationState = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationState must be used within a global Provider');
  }
  return context;
};

export const ApplicationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const applicationQuery = useApplicationQuery();
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [application, setApplication] = useState<IApplication>();
  const [filter, setFilter] = useState<IApplicationFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchApplications = async (filter: IApplicationFilter): Promise<IApplication[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return applicationQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.applicationPage;
        if (data) {
          setApplications(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchApplication = async (id: string): Promise<IApplication> => {
    return applicationQuery
      .find({
        variables: { application: { _id: id } }
      })
      .then((res) => {
        const data = res?.data?.findOneApplication
        if (data) {
          setApplication(data);
          return data;
        }
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createApplication = async (payload: IApplicationPayload): Promise<IApplication | null> => {
    setUpdating(true);
    return applicationQuery
      .create({
        variables: { application: payload }
      })
      .then((res) => {
        const data: IApplication = res?.data?.createApplication;
        if (data) {
          setApplications([data, ...applications]);
          fetchApplication(data._id)
          return data;
        }
        toastSvc.success('Application created successfully')
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateApplication = async (_id: string, payload: IApplicationPayload): Promise<IApplication | null> => {
    setUpdating(true);
    return applicationQuery
      .update({
        variables: { _id, application: payload }
      })
      .then((res) => {
        const data: IApplication = res?.data?.updateApplication;
        if (data) {
          setApplications(applications?.map((g) => (g._id === _id ? data : g)));
          fetchApplication(data._id)
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveApplication = async (payload: IApplicationPayload, _id?: string): Promise<IApplication | null> => {
    if (_id) {
      return updateApplication(_id, payload);
    }
    return createApplication(payload);
  };

  const updateStatus = async (payload: IApplicationStatusUpdate): Promise<IApplication> => {
    setUpdating(true);
    return applicationQuery
      .updateStatus({ variables: { status: payload } })
      .then((res) => {
        const data: IApplication = res?.data?.updateApplicationStatus;
        if (data) {
          setApplication(data)
          return data;
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  }

  const removeApplication = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return applicationQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IApplication = res?.data?.deleteApplication;
        if (data) {
          setApplications(applications.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ApplicationContext.Provider
      value={{
        application,
        fetchApplication,
        setApplication,
        modal,
        updateStatus,
        setModal,
        fetchApplications,
        applications,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveApplication,
        removeApplication,
        createApplication
      } as any}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
