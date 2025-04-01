import React, { createContext, useState } from 'react';
import { toastSvc } from '../../services';
import { NodeService } from '../../services/node';
import { useCreateMaster, useDeleteMaster, useLazyMasterPage, useUpdateMaster } from './gql/query';
import { IMaster, IMasterFilter } from './model';
import { mapPageFilter } from '@/helper';

interface IMasterState {
  loading: boolean;
  updateLoading: boolean;
  totalRecords: number;
  master: IMaster[];
  masterNode: IMaster[];
  getMasterByKey: (key: string) => IMaster;
  setMaster: (master: IMaster[]) => void;
  fetchMaster: () => Promise<void>;
  deleteMaster: (item: IMaster) => Promise<void>;
  createMaster: (res: IMaster) => Promise<IMaster>;
  updateMaster: (id: string, res: IMaster) => Promise<IMaster>;
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
  const [master, setMaster] = useState<IMaster[]>([]);
  const [skip, setSkip] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [masterNode, setMasterNode] = useState<IMaster[]>([]);

  const fetchQ = useLazyMasterPage((res) => {});

  const createQuery = useCreateMaster((res: any) => {
    toastSvc.success('Master Created');
  });

  const updateQuery = useUpdateMaster((rs) => {
    toastSvc.success('Master Updated');
  });

  const deleteQuery = useDeleteMaster((res) => {
    toastSvc.success('Master Deleted');
  });

  const fetchMaster = () => {
    return fetchMasterPage({ page: 0, pageSize: 10000 });
  };

  const fetchMasterPage = (page: IMasterFilter) => {
    let payload: any = mapPageFilter(page);

    return fetchQ[0]({
      variables: {
        page: { ...payload }
      }
    }).then((res) => {
      const data = res?.data?.masterPage;
      if (data) {
        setMaster(data.data);
        setTotalRecords(data.totalRecords);

        setMasterNode(NodeService.mapParentAndChildren(data.data as any) as any);
      }
    });
  };

  const createMaster = (values: any) => {
    setUpdateLoading(true);
    return createQuery[0]({
      variables: {
        master: {
          ...values
        }
      }
    }).then((res) => {
      setUpdateLoading(false);
      const create = res?.data?.createMaster;
      if (create) {
        setMaster([create, ...master]);
      }
      return create;
    });
  };

  const updateMaster = (id: string, values: any) => {
    setUpdateLoading(true);

    return updateQuery[0]({
      variables: {
        id,
        master: {
          ...values
        }
      }
    }).then((res) => {
      setUpdateLoading(false);
      const update = res?.data?.updateMaster;
      // if (update) {
      //   setMaster(
      //     master.map((n: any) => (n?._id === update?._id ? update : n))
      //   );
      // }
      return update;
    });
  };

  const deleteMaster = (item: IMaster) => {
    return deleteQuery[0]({ variables: { id: item._id } }).then((res) => {
      const data = res?.data?.deleteMaster;
      if (data) {
        let delMaster = master;
        if (delMaster) {
          setMaster(
            delMaster?.filter((m: any) =>
              m?._id === item?._id
                ? {
                    ...m,
                    children: m?.children?.filter((c: any) => c?._id !== m?._id)
                  }
                : m
            )
          );
        }
        setMaster(master.filter((p, i) => p?._id !== item?._id));
      }
      return data;
    });
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

  return (
    <MasterContext.Provider
      value={{
        master,
        masterNode,
        setMaster,
        fetchMaster,
        loading: fetchQ[1].loading,
        updateLoading,
        totalRecords,
        deleteMaster,
        updateMaster,
        createMaster,
        getMasterByKey
      }}
    >
      {children}
    </MasterContext.Provider>
  );
};
