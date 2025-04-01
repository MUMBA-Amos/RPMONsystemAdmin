import React, { createContext, useState } from 'react';
import { toastSvc } from '../../services';
import { NodeService } from '../../services/node';
import { useMasterQuery } from './gql/query';
import { IMaster, IMasterFilter } from './model';
import { mapPageFilter } from '@/helper';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface IMasterState {
  loading: boolean;
  updateLoading: boolean;
  totalRecords: number;
  filter: IMasterFilter;
  master: IMaster[];
  masterNode: IMaster[];
  getMasterByKey: (key: string) => IMaster;
  setMaster: (master: IMaster[]) => void;
  fetchMaster: (page: IMasterFilter) => Promise<IMaster[]>;
  deleteMaster: (_id: string) => Promise<boolean>;
  saveMaster: (_id: string, payload: any) => Promise<IMaster | null>;
  setFilter: React.Dispatch<React.SetStateAction<IMasterFilter>>;
}
const MasterContext = createContext<IMasterState | undefined>(undefined);

export const useMasterState = () => {
  const context = React.useContext(MasterContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within the app global provider');
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const MasterContextProvider: React.FC<IProps> = ({ children }) => {
  const masterQuery = useMasterQuery();
  const [master, setMaster] = useState<IMaster[]>([]);
  const [skip, setSkip] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [masterNode, setMasterNode] = useState<IMaster[]>([]);
  const [filter, setFilter] = useState<IMasterFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });

  const fetchMaster = async (page: IMasterFilter): Promise<IMaster[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(page);

    return masterQuery
      .page({
        variables: {
          page: { ...payload }
        }
      })
      .then((res) => {
        const data = res?.data?.masterPage;
        if (data) {
          setMaster(data.data);
          setTotalRecords(data.totalRecords);
          setMasterNode(NodeService.mapParentAndChildren(data.data as any) as any);
          return data?.data;
        }
        return [];
      })
      .finally(() => setLoading(false));
  };

  const createMaster = async (values: any): Promise<IMaster | null> => {
    setUpdateLoading(true);
    return masterQuery
      .create({
        variables: {
          master: {
            ...values
          }
        }
      })
      .then((res) => {
        const create = res?.data?.createMaster;
        if (create) {
          setMaster([create, ...master]);
          return create;
        }
        return null;
      })
      .finally(() => setUpdateLoading(false));
  };

  const updateMaster = async (id: string, values: any): Promise<IMaster | null> => {
    setUpdateLoading(true);

    return masterQuery
      .update({
        variables: {
          id,
          master: {
            ...values
          }
        }
      })
      .then((res) => {
        const update = res?.data?.updateMaster;
        if (update) {
          setMaster(
            master.map((n: any) =>
              n?._id === update?._id
                ? {
                    ...n,
                    children: n?.children?.map((c: any) => c?._id !== n?._id)
                  }
                : n
            )
          );
          return update;
        }
        return null;
      })
      .finally(() => setUpdateLoading(false));
  };

  const deleteMaster = async (_id: string): Promise<boolean> => {
    setLoading(true);
    return masterQuery
      .remove({ variables: { id: _id } })
      .then((res) => {
        const data = res?.data?.deleteMaster;
        if (data) {
          let delMaster = master;
          if (delMaster) {
            setMaster(
              delMaster?.filter((m: any) =>
                m?._id === _id
                  ? {
                      ...m,
                      children: m?.children?.filter((c: any) => c?._id !== m?._id)
                    }
                  : m
              )
            );
            return true;
          }
          setMaster(master.filter((p, i) => p?._id !== _id));
        }
        return false;
      })
      .finally(() => setLoading(false));
  };

  const getMasterByKey = (key: string): IMaster => {
    const data = masterNode.find((m) => m.key === key);

    const rs = {
      ...data,
      label: data?.name,
      value: data?._id,
      children: data?.children?.map((c) => ({
        ...c,
        label: c.name,
        value: c._id
      }))
    } as any;

    return rs;
  };

  const saveMaster = async (_id: string, payload: any) => {
    if (_id) return updateMaster(_id, payload);
    return createMaster(payload);
  };
  return (
    <MasterContext.Provider
      value={{
        master,
        masterNode,
        setMaster,
        fetchMaster,
        filter,
        setFilter,
        loading,
        updateLoading,
        totalRecords,
        deleteMaster,
        saveMaster,
        getMasterByKey
      }}
    >
      {children}
    </MasterContext.Provider>
  );
};
