import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useGrantQuery } from './gql/query';
import type { IGrant, IGrantFilter, IGrantPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IGrantState {
  loading: boolean;
  updating: boolean;
  grants: IGrant[];
  totalRecords: number;
  filter: IGrantFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IGrantFilter>>;
  fetchGrants: (page: IGrantFilter) => Promise<IGrant[]>;
  saveGrant: (_id: string, payload: IGrantPayload) => Promise<IGrant | null>;
  removeGrant: (_id: string) => Promise<boolean>;
}

const GrantContext = createContext<IGrantState | undefined>(undefined);

export const useGrantState = () => {
  const context = useContext(GrantContext);
  if (!context) {
    throw new Error('useGrantState must be used within a global Provider');
  }
  return context;
};

export const GrantContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const grantQuery = useGrantQuery();
  const [grants, setGrants] = useState<IGrant[]>([]);
  const [filter, setFilter] = useState<IGrantFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchGrants = async (filter: IGrantFilter): Promise<IGrant[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return grantQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.grantPage;
        if (data) {
          setGrants(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createGrant = async (payload: IGrantPayload): Promise<IGrant | null> => {
    setUpdating(true);
    return grantQuery
      .create({
        variables: { grant: payload }
      })
      .then((res) => {
        const data: IGrant = res?.data?.createGrant;
        if (data) {
          setGrants([data, ...grants]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateGrant = async (_id: string, payload: IGrantPayload): Promise<IGrant | null> => {
    setUpdating(true);
    return grantQuery
      .update({
        variables: { _id, grant: payload }
      })
      .then((res) => {
        const data: IGrant = res?.data?.updateGrant;
        if (data) {
          setGrants(grants?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveGrant = async (_id: string, payload: IGrantPayload): Promise<IGrant | null> => {
    if (_id) {
      return updateGrant(_id, payload);
    }
    return createGrant(payload);
  };

  const removeGrant = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return grantQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IGrant = res?.data?.deleteGrant;
        if (data) {
          setGrants(grants.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <GrantContext.Provider
      value={{
        modal,
        setModal,
        fetchGrants,
        grants,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveGrant,
        removeGrant
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};
