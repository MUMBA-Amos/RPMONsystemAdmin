import React, { createContext, useState } from 'react';
import { useUserQuery } from './gql/query';
import { IUser, IUserFilter } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { mapPageFilter } from '@/helper';

interface IUserState {
  loading: boolean;
  totalRecords: number;
  users: IUser[];
  user: IUser | undefined;
  filter: IUserFilter;
  setFilter: React.Dispatch<React.SetStateAction<IUserFilter>>;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  findOneUser: (query: Partial<IUser>) => Promise<IUser>;
  fetchUserPage: (page: IUserFilter) => Promise<IUser[]>;
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
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser>();
  const [totalRecords, setTotalRecords] = useState(0);
  const [filter, setFilter] = useState<IUserFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const usersQ = useUserQuery();

  const fetchUserPage = async (page: IUserFilter): Promise<IUser[]> => {
    let payload: any = mapPageFilter(page);

    return usersQ
      .page({
        variables: {
          page: {
            ...payload
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
      });
  };

  const findOneUser = async (user: Partial<IUser>): Promise<IUser> => {
    return usersQ
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
      });
  }

  return (
    <UserContext.Provider
      value={{
        users,
        user,
        loading: usersQ.loading,
        totalRecords,
        filter,
        setFilter,
        setUsers,
        findOneUser,
        fetchUserPage
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
