import React, { useState } from 'react';
import { createContext } from 'react';
import { toastSvc } from '../../services';
import { IInvite, IInviteFilter } from './model';
import { useInviteQuery } from './gql/query';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IInviteState {
  loading: boolean;
  updating: boolean;
  modal: IModal<'create' | 'update'>;
  totalRecords: number;
  filter: IInviteFilter;
  invites: IInvite[];
  fetchInvite: (filter: IInviteFilter) => void;
  saveInvite: (_id: string, payload: Partial<IInvite>) => Promise<IInvite | null>;
  removeInvite: (_id: string) => Promise<boolean>;
  setFilter: React.Dispatch<React.SetStateAction<IInviteFilter>>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update'>>>;
}

const InviteContext = createContext<IInviteState | undefined>(undefined);

export const useInviteState = () => {
  const context = React.useContext(InviteContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const InviteContextProvider: React.FC<IProps> = ({ children }) => {
  const inviteQuery = useInviteQuery();
  const [invites, setInvites] = useState<IInvite[]>([]);
  const [filter, setFilter] = useState<IInviteFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [modal, setModal] = useState<IModal<'create' | 'update'>>({ show: false });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchInvite = async (filter: IInviteFilter): Promise<{ data: IInvite[] }> => {
    setLoading(true);
    const payload = mapPageFilter(filter);
    return inviteQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res.data?.invitePage;
        if (data) {
          setInvites(data?.data);
          setTotalRecords(data?.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createInvite = async (payload: Partial<IInvite>): Promise<IInvite | null> => {
    setUpdating(true);
    return inviteQuery
      .create({ variables: { invite: payload } })
      .then((res) => {
        const data: IInvite = res?.data?.createInvite;
        if (data) {
          setInvites([data, ...invites]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateInvite = async (_id: string, payload: Partial<IInvite>): Promise<IInvite | null> => {
    setUpdating(true);
    return inviteQuery
      .update({ variables: { _id, invite: payload } })
      .then((res) => {
        const data: IInvite = res?.data?.updateInvite;
        if (data) {
          setInvites(invites.map((inv) => (inv._id === _id ? data : inv)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveInvite = async (_id: string, payload: Partial<IInvite>): Promise<IInvite | null> => {
    if (_id) {
      return updateInvite(_id, payload);
    }
    return createInvite(payload);
  };

  const removeInvite = async (_id: string): Promise<boolean> => {
    setLoading(true);
    return inviteQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data = res?.data?.deleteInvite;
        if (data) {
          setInvites(invites?.filter((inv) => inv._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <InviteContext.Provider
      value={{
        loading,
        updating,
        invites,
        fetchInvite,
        saveInvite,
        removeInvite,
        filter,
        modal,
        setModal,
        setFilter,
        totalRecords
      }}
    >
      {children}
    </InviteContext.Provider>
  );
};
