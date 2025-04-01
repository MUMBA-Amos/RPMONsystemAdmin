import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useExtenstionQuery } from './gql/query';
import type { IExtenstion, IExtenstionFilter, IExtenstionPayload, IExtenstionStatusUpdate } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IExtenstionState {
  loading: boolean;
  updating: boolean;
  extenstions: IExtenstion[];
  totalRecords: number;
  filter: IExtenstionFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IExtenstionFilter>>;
  fetchExtenstions: (page: IExtenstionFilter) => Promise<IExtenstion[]>;
  updateStatus: (status: IExtenstionStatusUpdate) => Promise<IExtenstion>;
  saveExtenstion: (payload: IExtenstionPayload, _id?: string) => Promise<IExtenstion | null>;
  removeExtenstion: (_id: string) => Promise<boolean>;
  setExtenstions: (extenstions: IExtenstion[]) => void
}

const ExtenstionContext = createContext<IExtenstionState | undefined>(undefined);

export const useExtenstionState = () => {
  const context = useContext(ExtenstionContext);
  if (!context) {
    throw new Error('useExtenstionState must be used within a global Provider');
  }
  return context;
};

export const ExtenstionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const extenstionQuery = useExtenstionQuery();
  const [extenstions, setExtenstions] = useState<IExtenstion[]>([]);
  const [filter, setFilter] = useState<IExtenstionFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchExtenstions = async (filter: IExtenstionFilter): Promise<IExtenstion[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return extenstionQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.extenstionPage;
        if (data) {
          setExtenstions(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createExtenstion = async (payload: IExtenstionPayload): Promise<IExtenstion | null> => {
    setUpdating(true);
    return extenstionQuery
      .create({
        variables: { extenstion: payload }
      })
      .then((res) => {
        const data: IExtenstion = res?.data?.createExtenstion;
        if (data) {
          setExtenstions([data, ...extenstions]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateExtenstion = async (_id: string, payload: IExtenstionPayload): Promise<IExtenstion | null> => {
    setUpdating(true);
    return extenstionQuery
      .update({
        variables: { _id, extenstion: payload }
      })
      .then((res) => {
        const data: IExtenstion = res?.data?.updateExtenstion;
        if (data) {
          setExtenstions(extenstions?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveExtenstion = async (payload: IExtenstionPayload, _id?: string): Promise<IExtenstion | null> => {
    if (_id) {
      return updateExtenstion(_id, payload);
    }
    return createExtenstion(payload);
  };

  const updateStatus = async (status: IExtenstionStatusUpdate): Promise<IExtenstion> => {
    setUpdating(true);
    return extenstionQuery
      .updateStatus({
        variables: { status }
      })
      .then((res) => {
        const data: IExtenstion = res?.data?.updateExtenstionStatus;
        if (data) {
          setExtenstions(extenstions?.map((g) => (g._id === status._id ? data : g)));
          return data;
        }
        return {} as IExtenstion;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const removeExtenstion = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return extenstionQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IExtenstion = res?.data?.deleteExtenstion;
        if (data) {
          setExtenstions(extenstions.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ExtenstionContext.Provider
      value={{
        modal,
        setModal,
        fetchExtenstions,
        extenstions,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        updateStatus,
        saveExtenstion,
        removeExtenstion,
        setExtenstions
      }}
    >
      {children}
    </ExtenstionContext.Provider>
  );
};
