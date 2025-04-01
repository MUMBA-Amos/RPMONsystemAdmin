import React, { useState } from 'react';
import { createContext } from 'react';
import { toastSvc } from '../../services';
import { IBatch, IBatchFilter } from './model';
import { useBatchQuery } from './gql/query';
import { IModal } from '@/components';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { mapPageFilter } from '@/helper';

interface IBatchState {
  loading: boolean;
  updating: boolean;
  totalRecords: number;
  batches: IBatch[];
  filter: IBatchFilter;
  setFilter: React.Dispatch<React.SetStateAction<IBatchFilter>>;
  modal: IModal<'create' | 'update'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update'>>>;
  deleteBatch: (_id: string) => Promise<Boolean>;
  fetchBatch: (filter: IBatchFilter) => Promise<{ data: IBatch[] }>;
  saveBatch: (_id: string, payload: IBatch) => Promise<IBatch | null>;
}

const BatchContext = createContext<IBatchState | undefined>(undefined);

export const useBatchState = () => {
  const context = React.useContext(BatchContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const BatchContextProvider: React.FC<IProps> = ({ children }) => {
  const batchQuery = useBatchQuery();
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [filter, setFilter] = useState<IBatchFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [modal, setModal] = useState<IModal<'create' | 'update'>>({ show: false });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchBatch = async (filter: IBatchFilter): Promise<{ data: IBatch[] }> => {
    setLoading(true);
    const payload: any = mapPageFilter(filter);
    return batchQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.batchPage;
        if (data) {
          setBatches(data?.data);
          setTotalRecords(data?.totalRecords);
          return data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createBatch = async (payload: Partial<IBatch>): Promise<IBatch | null> => {
    setUpdating(true);
    return batchQuery
      .create({ variables: { batch: payload } })
      .then((res) => {
        const data: IBatch = res?.data?.createBatch;
        if (data) {
          setBatches([data, ...batches]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateBatch = async (_id: string, payload: Partial<IBatch>): Promise<IBatch> => {
    setUpdating(true);
    return batchQuery
      .update({ variables: { _id, batch: payload } })
      .then((res) => {
        const data: IBatch = res?.data?.updateBatch;
        if (data) {
          setBatches(batches.map((batch) => (batch._id === _id ? data : batch)));
          return data;
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveBatch = async (_id: string, payload: Partial<IBatch>): Promise<IBatch | null> => {
    if (_id) return updateBatch(_id, payload);

    return createBatch(payload);
  };

  const deleteBatch = async (_id: string): Promise<boolean> => {
    setLoading(true);
    return batchQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IBatch = res?.data?.deleteBatch;
        if (data) {
          setBatches(batches.filter((batch) => batch._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <BatchContext.Provider
      value={{
        loading,
        updating,
        batches,
        totalRecords,
        modal,
        setModal,
        filter,
        setFilter,
        fetchBatch,
        saveBatch,
        deleteBatch
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};
