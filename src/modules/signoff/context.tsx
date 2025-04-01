import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useSignoffQuery } from './gql/query';
import type { ISignoff, ISignoffFilter, ISignoffPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface ISignoffState {
  loading: boolean;
  updating: boolean;
  signoffs: ISignoff[];
  totalRecords: number;
  filter: ISignoffFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<ISignoffFilter>>;
  fetchSignoffs: (page: ISignoffFilter) => Promise<ISignoff[]>;
  saveSignoff: (payload: ISignoffPayload, _id?: string) => Promise<ISignoff | null>;
  removeSignoff: (_id: string) => Promise<boolean>;
  setSignoffs: (signoffs: ISignoff[]) => void
}

const SignoffContext = createContext<ISignoffState | undefined>(undefined);

export const useSignoffState = () => {
  const context = useContext(SignoffContext);
  if (!context) {
    throw new Error('useSignoffState must be used within a global Provider');
  }
  return context;
};

export const SignoffContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const signoffQuery = useSignoffQuery();
  const [signoffs, setSignoffs] = useState<ISignoff[]>([]);
  const [filter, setFilter] = useState<ISignoffFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchSignoffs = async (filter: ISignoffFilter): Promise<ISignoff[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return signoffQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.signoffPage;
        if (data) {
          setSignoffs(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createSignoff = async (payload: ISignoffPayload): Promise<ISignoff | null> => {
    setUpdating(true);
    return signoffQuery
      .create({
        variables: { signoff: payload }
      })
      .then((res) => {
        const data: ISignoff = res?.data?.createSignoff;
        if (data) {
          setSignoffs([data, ...signoffs]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateSignoff = async (_id: string, payload: ISignoffPayload): Promise<ISignoff | null> => {
    setUpdating(true);
    return signoffQuery
      .update({
        variables: { _id, signoff: payload }
      })
      .then((res) => {
        const data: ISignoff = res?.data?.updateSignoff;
        if (data) {
          setSignoffs(signoffs?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveSignoff = async (payload: ISignoffPayload, _id?: string): Promise<ISignoff | null> => {
    if (_id) {
      return updateSignoff(_id, payload);
    }
    return createSignoff(payload);
  };

  const removeSignoff = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return signoffQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: ISignoff = res?.data?.deleteSignoff;
        if (data) {
          setSignoffs(signoffs.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <SignoffContext.Provider
      value={{
        modal,
        setModal,
        fetchSignoffs,
        signoffs,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveSignoff,
        removeSignoff,
        setSignoffs
      }}
    >
      {children}
    </SignoffContext.Provider>
  );
};
