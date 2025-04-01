import React, { createContext, useState } from 'react';
import { useUserQuery } from './gql/query';
import { IUser, IUserFilter } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { mapPageFilter } from '@/helper';
import { IModal } from '@/components';

interface IUserState {
  loading: boolean;
  updating: boolean;
  modal: IModal<'create' | 'update'>;
  totalRecords: number;
  users: IUser[];
  user: IUser | undefined;
  filter: IUserFilter;
  setFilter: React.Dispatch<React.SetStateAction<IUserFilter>>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update'>>>;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  findOneUser: (query: Partial<IUser>) => Promise<IUser>;
  fetchUsers: (page: IUserFilter) => Promise<IUser[]>;
  updateUser: (_id: string, payload: Partial<IUser>) => Promise<IUser>;
}

const UserContext = createContext<IUserState | undefined>(undefined);

export const useUserState = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within the app global provider');
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const UserContextProvider: React.FC<IProps> = ({ children }) => {
  const userQ = useUserQuery();
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser>();
  const [totalRecords, setTotalRecords] = useState(0);
  const [filter, setFilter] = useState<IUserFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const [modal, setModal] = useState<IModal<'create' | 'update'>>({ show: false });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async (page: IUserFilter): Promise<IUser[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(page);

    return userQ
      .page({
        variables: {
          page: {
            ...payload,
            keyword: page?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.userPage;
        if (data) {
          setUsers(data?.data);
          setTotalRecords(data?.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findOneUser = async (user: Partial<IUser>): Promise<IUser> => {
    return userQ
      .findOne({
        variables: {
          user
        }
      })
      .then((res) => {
        const data = res?.data?.findOneUser;

        if (data) {
          setUser(data);
          return data;
        }
        return null;
      });
  };

  const updateUser = async (_id: string, payload: Partial<IUser>): Promise<IUser> => {
    setUpdating(true);
    return userQ
      .update({ variables: { _id, organization: payload } })
      .then((res) => {
        const data: IUser = res?.data?.updateOrganization;
        if (data) {
          setUsers(users.map((org) => (org._id === _id ? data : org)));
          return data;
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <UserContext.Provider
      value={{
        users,
        user,
        loading,
        updating,
        modal,
        setModal,
        updateUser,
        totalRecords,
        filter,
        setFilter,
        setUsers,
        findOneUser,
        fetchUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
