import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useTeamMemberQuery } from './gql/query';
import type { ITeamMember, ITeamMemberFilter, ITeamMemberPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface ITeamMemberState {
  loading: boolean;
  updating: boolean;
  teamMembers: ITeamMember[];
  totalRecords: number;
  filter: ITeamMemberFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<ITeamMemberFilter>>;
  fetchTeamMembers: (page: ITeamMemberFilter) => Promise<ITeamMember[]>;
  saveTeamMember: (payload: ITeamMemberPayload, _id?: string) => Promise<ITeamMember | null>;
  removeTeamMember: (_id: string) => Promise<boolean>;
  setTeamMembers: (teamMembers: ITeamMember[]) => void
}

const TeamMemberContext = createContext<ITeamMemberState | undefined>(undefined);

export const useTeamMemberState = () => {
  const context = useContext(TeamMemberContext);
  if (!context) {
    throw new Error('useTeamMemberState must be used within a global Provider');
  }
  return context;
};

export const TeamMemberContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const teamMemberQuery = useTeamMemberQuery();
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [filter, setFilter] = useState<ITeamMemberFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchTeamMembers = async (filter: ITeamMemberFilter): Promise<ITeamMember[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return teamMemberQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.teamMemberPage;
        if (data) {
          setTeamMembers(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createTeamMember = async (payload: ITeamMemberPayload): Promise<ITeamMember | null> => {
    setUpdating(true);
    return teamMemberQuery
      .create({
        variables: { teamMember: payload }
      })
      .then((res) => {
        const data: ITeamMember = res?.data?.createTeamMember;
        if (data) {
          setTeamMembers([data, ...teamMembers]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateTeamMember = async (_id: string, payload: ITeamMemberPayload): Promise<ITeamMember | null> => {
    setUpdating(true);
    return teamMemberQuery
      .update({
        variables: { _id, teamMember: payload }
      })
      .then((res) => {
        const data: ITeamMember = res?.data?.updateTeamMember;
        if (data) {
          setTeamMembers(teamMembers?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveTeamMember = async (payload: ITeamMemberPayload, _id?: string): Promise<ITeamMember | null> => {
    if (_id) {
      return updateTeamMember(_id, payload);
    }
    return createTeamMember(payload);
  };

  const removeTeamMember = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return teamMemberQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: ITeamMember = res?.data?.deleteTeamMember;
        if (data) {
          setTeamMembers(teamMembers.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <TeamMemberContext.Provider
      value={{
        modal,
        setModal,
        fetchTeamMembers,
        teamMembers,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveTeamMember,
        removeTeamMember,
        setTeamMembers
      }}
    >
      {children}
    </TeamMemberContext.Provider>
  );
};
