import React, { useState } from 'react';
import { createContext } from 'react';
import { toastSvc } from '../../services';
import { IOrganization, IOrganizationFilter } from './model';
import { useOrganizationQuery } from './gql/query';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface IOrganizationState {
  loading: boolean;
  updating: boolean;
  totalRecords: number;
  filter: IOrganizationFilter;
  organizations: IOrganization[];
  modal: IModal<'create' | 'update'>;
  setFilter: React.Dispatch<React.SetStateAction<IOrganizationFilter>>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update'>>>;
  deleteOrganization: (_id: string) => Promise<Boolean>;
  fetchOrganization: (filter: IOrganizationFilter) => Promise<{data: IOrganization[]}>;
  saveOrganization: (_id: string, payload: IOrganization) => Promise<IOrganization | null>;
}

const OrganizationContext = createContext<IOrganizationState | undefined>(undefined);

export const useOrganizationState = () => {
  const context = React.useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within app global provider');
  }

  return context;
};
interface IProps {
  children: React.ReactNode;
}

export const OrganizationContextProvider: React.FC<IProps> = ({ children }) => {
  const organizationQuery = useOrganizationQuery();
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [modal, setModal] = useState<IModal<'create' | 'update'>>({ show: false });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filter, setFilter] = useState<IOrganizationFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const fetchOrganization = async (
    filter: IOrganizationFilter
  ): Promise<{ data: IOrganization[] }> => {
    setLoading(true);
    const payload: any = mapPageFilter(filter);
    return organizationQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res.data?.organizationPage;
        if (data) {
          setOrganizations(data?.data);
          setTotalRecords(data?.totalRecords);
          return data;
        }
        return { data: [] };
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveOrganization = async (
    _id: string,
    payload: Partial<IOrganization>
  ): Promise<IOrganization | null> => {
    if (_id) {
      return updateOrganization(_id, payload);
    }
    return createOrganization(payload);
  };

  const createOrganization = async (
    payload: Partial<IOrganization>
  ): Promise<IOrganization | null> => {
    setUpdating(true);
    return organizationQuery
      .create({ variables: { organization: payload } })
      .then((res) => {
        const data: IOrganization = res?.data?.createOrganization;
        if (data) {
          setOrganizations([data, ...organizations]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateOrganization = async (
    _id: string,
    payload: Partial<IOrganization>
  ): Promise<IOrganization> => {
    setUpdating(true);
    return organizationQuery
      .update({ variables: { _id, organization: payload } })
      .then((res) => {
        const data: IOrganization = res?.data?.updateOrganization;
        if (data) {
          setOrganizations(organizations.map((org) => (org._id === _id ? data : org)));
          return data;
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const deleteOrganization = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return organizationQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IOrganization = res?.data?.deleteOrganization;
        if (data) {
          setOrganizations(organizations.filter((org) => org._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };
  return (
    <OrganizationContext.Provider
      value={{
        loading,
        updating,
        organizations,
        totalRecords,
        filter,
        setFilter,
        modal,
        setModal,
        fetchOrganization,
        saveOrganization,
        deleteOrganization
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
