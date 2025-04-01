import React, { useState } from 'react';
import { createContext } from 'react';
import { IVoteHead, IVoteHeadFilter } from './model';
import { useVoteHeadQuery } from './gql/query';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IVoteHeadState {
  loading: boolean;
  updating: boolean;
  modal: IModal<'create' | 'update'>;
  totalRecords: number;
  filter: IVoteHeadFilter;
  voteHeads: IVoteHead[];
  fetchVoteHead: (filter: IVoteHeadFilter) => void;
  saveVoteHead: (_id: string, payload: Partial<IVoteHead>) => Promise<IVoteHead | null>;
  removeVoteHead: (_id: string) => Promise<boolean>;
  setFilter: React.Dispatch<React.SetStateAction<IVoteHeadFilter>>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update'>>>;
}

const VoteHeadContext = createContext<IVoteHeadState | undefined>(undefined);

export const useVoteHeadState = () => {
  const context = React.useContext(VoteHeadContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const VoteHeadContextProvider: React.FC<IProps> = ({ children }) => {
  const voteHeadQuery = useVoteHeadQuery();
  const [voteHeads, setVoteHeads] = useState<IVoteHead[]>([]);
  const [filter, setFilter] = useState<IVoteHeadFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [modal, setModal] = useState<IModal<'create' | 'update'>>({ show: false });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchVoteHead = async (filter: IVoteHeadFilter): Promise<{ data: IVoteHead[] }> => {
    setLoading(true);
    const payload = mapPageFilter(filter);
    return voteHeadQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res.data?.voteHeadPage;
        if (data) {
          setVoteHeads(data?.data);
          setTotalRecords(data?.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createVoteHead = async (payload: Partial<IVoteHead>): Promise<IVoteHead | null> => {
    setUpdating(true);
    return voteHeadQuery
      .create({ variables: { voteHead: payload } })
      .then((res) => {
        const data: IVoteHead = res?.data?.createVoteHead;
        if (data) {
          setVoteHeads([data, ...voteHeads]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateVoteHead = async (
    _id: string,
    payload: Partial<IVoteHead>
  ): Promise<IVoteHead | null> => {
    setUpdating(true);
    return voteHeadQuery
      .update({ variables: { _id, voteHead: payload } })
      .then((res) => {
        const data: IVoteHead = res?.data?.updateVoteHead;
        if (data) {
          setVoteHeads(voteHeads.map((inv) => (inv._id === _id ? data : inv)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveVoteHead = async (
    _id: string,
    payload: Partial<IVoteHead>
  ): Promise<IVoteHead | null> => {
    if (_id) {
      return updateVoteHead(_id, payload);
    }
    return createVoteHead(payload);
  };

  const removeVoteHead = async (_id: string): Promise<boolean> => {
    setLoading(true);
    return voteHeadQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data = res?.data?.deleteVoteHead;
        if (data) {
          setVoteHeads(voteHeads?.filter((inv) => inv._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <VoteHeadContext.Provider
      value={{
        loading,
        updating,
        voteHeads,
        fetchVoteHead,
        saveVoteHead,
        removeVoteHead,
        filter,
        modal,
        setModal,
        setFilter,
        totalRecords
      }}
    >
      {children}
    </VoteHeadContext.Provider>
  );
};
