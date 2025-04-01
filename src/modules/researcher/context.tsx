import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useResearcherQuery } from './gql/query';
import type { IResearcher, IResearcherFilter, IResearcherPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IResearcherState {
  loading: boolean;
  updating: boolean;
  researchers: IResearcher[];
  totalRecords: number;
  filter: IResearcherFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IResearcherFilter>>;
  fetchResearchers: (page: IResearcherFilter) => Promise<IResearcher[]>;
  saveResearcher: (payload: IResearcherPayload, _id?: string) => Promise<IResearcher | null>;
  removeResearcher: (_id: string) => Promise<boolean>;
  setResearchers: (researchers: IResearcher[]) => void
}

const ResearcherContext = createContext<IResearcherState | undefined>(undefined);

export const useResearcherState = () => {
  const context = useContext(ResearcherContext);
  if (!context) {
    throw new Error('useResearcherState must be used within a global Provider');
  }
  return context;
};

export const ResearcherContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const researcherQuery = useResearcherQuery();
  const [researchers, setResearchers] = useState<IResearcher[]>([]);
  const [filter, setFilter] = useState<IResearcherFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchResearchers = async (filter: IResearcherFilter): Promise<IResearcher[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return researcherQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.researcherPage;
        if (data) {
          setResearchers(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createResearcher = async (payload: IResearcherPayload): Promise<IResearcher | null> => {
    setUpdating(true);
    return researcherQuery
      .create({
        variables: { Researcher: payload }
      })
      .then((res) => {
        const data: IResearcher = res?.data?.createResearcher;
        if (data) {
          setResearchers([data, ...researchers]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateResearcher = async (_id: string, payload: IResearcherPayload): Promise<IResearcher | null> => {
    setUpdating(true);
    return researcherQuery
      .update({
        variables: { _id, researcher: payload }
      })
      .then((res) => {
        const data: IResearcher = res?.data?.updateResearcher;
        if (data) {
          setResearchers(researchers?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveResearcher = async (payload: IResearcherPayload, _id?: string): Promise<IResearcher | null> => {
    if (_id) {
      return updateResearcher(_id, payload);
    }
    return createResearcher(payload);
  };

  const removeResearcher = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return researcherQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IResearcher = res?.data?.deleteResearcher;
        if (data) {
          setResearchers(researchers.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ResearcherContext.Provider
      value={{
        modal,
        setModal,
        fetchResearchers,
        researchers,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveResearcher,
        removeResearcher,
        setResearchers
      }}
    >
      {children}
    </ResearcherContext.Provider>
  );
};
