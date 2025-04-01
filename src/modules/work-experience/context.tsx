import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useWorkExperienceQuery } from './gql/query';
import type { IWorkExperience, IWorkExperienceFilter, IWorkExperiencePayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IWorkExperienceState {
  loading: boolean;
  updating: boolean;
  workExperiences: IWorkExperience[];
  totalRecords: number;
  filter: IWorkExperienceFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IWorkExperienceFilter>>;
  fetchWorkExperiences: (page: IWorkExperienceFilter) => Promise<IWorkExperience[]>;
  saveWorkExperience: (payload: IWorkExperiencePayload, _id?: string) => Promise<IWorkExperience | null>;
  removeWorkExperience: (_id: string) => Promise<boolean>;
  setWorkExperiences: (workExperiences: IWorkExperience[]) => void
}

const WorkExperienceContext = createContext<IWorkExperienceState | undefined>(undefined);

export const useWorkExperienceState = () => {
  const context = useContext(WorkExperienceContext);
  if (!context) {
    throw new Error('useWorkExperienceState must be used within a global Provider');
  }
  return context;
};

export const WorkExperienceContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const workExperienceQuery = useWorkExperienceQuery();
  const [workExperiences, setWorkExperiences] = useState<IWorkExperience[]>([]);
  const [filter, setFilter] = useState<IWorkExperienceFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchWorkExperiences = async (filter: IWorkExperienceFilter): Promise<IWorkExperience[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return workExperienceQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.workExperiencePage;
        if (data) {
          setWorkExperiences(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createWorkExperience = async (payload: IWorkExperiencePayload): Promise<IWorkExperience | null> => {
    setUpdating(true);
    return workExperienceQuery
      .create({
        variables: { workExperience: payload }
      })
      .then((res) => {
        const data: IWorkExperience = res?.data?.createWorkExperience;
        if (data) {
          setWorkExperiences([data, ...workExperiences]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateWorkExperience = async (_id: string, payload: IWorkExperiencePayload): Promise<IWorkExperience | null> => {
    setUpdating(true);
    return workExperienceQuery
      .update({
        variables: { _id, workExperience: payload }
      })
      .then((res) => {
        const data: IWorkExperience = res?.data?.updateWorkExperience;
        if (data) {
          setWorkExperiences(workExperiences?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveWorkExperience = async (payload: IWorkExperiencePayload, _id?: string): Promise<IWorkExperience | null> => {
    if (_id) {
      return updateWorkExperience(_id, payload);
    }
    return createWorkExperience(payload);
  };

  const removeWorkExperience = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return workExperienceQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IWorkExperience = res?.data?.deleteWorkExperience;
        if (data) {
          setWorkExperiences(workExperiences.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <WorkExperienceContext.Provider
      value={{
        modal,
        setModal,
        fetchWorkExperiences,
        workExperiences,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveWorkExperience,
        removeWorkExperience,
        setWorkExperiences
      }}
    >
      {children}
    </WorkExperienceContext.Provider>
  );
};
