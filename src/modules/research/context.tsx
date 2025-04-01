import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useResearchQuery } from './gql/query';
import type { IResearch, IResearchFilter, IResearchPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IResearchState {
  loading: boolean;
  updating: boolean;
  researchs: IResearch[];
  totalRecords: number;
  filter: IResearchFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IResearchFilter>>;
  fetchResearchs: (page: IResearchFilter) => Promise<IResearch[]>;
  saveResearch: (payload: IResearchPayload, _id?: string) => Promise<IResearch | null>;
  removeResearch: (_id: string) => Promise<boolean>;
  setResearchs: (researchs: IResearch[]) => void
}

const ResearchContext = createContext<IResearchState | undefined>(undefined);

export const useResearchState = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearchState must be used within a global Provider');
  }
  return context;
};

export const ResearchContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const researchQuery = useResearchQuery();
  const [researchs, setResearchs] = useState<IResearch[]>([]);
  const [filter, setFilter] = useState<IResearchFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchResearchs = async (filter: IResearchFilter): Promise<IResearch[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return researchQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.researchPage;
        if (data) {
          setResearchs(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createResearch = async (payload: IResearchPayload): Promise<IResearch | null> => {
    setUpdating(true);
    return researchQuery
      .create({
        variables: { research: payload }
      })
      .then((res) => {
        const data: IResearch = res?.data?.createResearch;
        if (data) {
          setResearchs([data, ...researchs]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateResearch = async (_id: string, payload: IResearchPayload): Promise<IResearch | null> => {
    setUpdating(true);
    return researchQuery
      .update({
        variables: { _id, research: payload }
      })
      .then((res) => {
        const data: IResearch = res?.data?.updateResearch;
        if (data) {
          setResearchs(researchs?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveResearch = async (payload: IResearchPayload, _id?: string): Promise<IResearch | null> => {
    if (_id) {
      return updateResearch(_id, payload);
    }
    return createResearch(payload);
  };

  const removeResearch = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return researchQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IResearch = res?.data?.deleteResearch;
        if (data) {
          setResearchs(researchs.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ResearchContext.Provider
      value={{
        modal,
        setModal,
        fetchResearchs,
        researchs,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveResearch,
        removeResearch,
        setResearchs
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};
