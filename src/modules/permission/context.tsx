import React, { createContext, use, useEffect, useState } from 'react';
import {
  ICreatePermissionInput,
  IPermissionModule,
  IPermissionModuleQueryInput,
  IUpdatePermissionInput
} from './model';
import { usePermissionQuery } from './gql/query';
import { toastSvc } from '../../services';
import { useSession } from 'next-auth/react';

interface IPermissionState {
  initLoading: boolean;
  permissions: IPermissionModule[];
  userAccess: IPermissionModule[];
  findUserAccess: () => Promise<void>;
  haveAccess: (module: string, object: any, action?: string) => any;
  haveViewAccess: (module: string, object: any, action?: string) => any;
  findPermissionModules: (query: IPermissionModuleQueryInput) => Promise<void>;
  addOrUpdatePermission: (permission: ICreatePermissionInput) => Promise<void>;
  updateAllPermision: (data: IUpdatePermissionInput) => Promise<void>;
}

const PermissionContext = createContext<IPermissionState | undefined>(undefined);

export const usePermissionState = () => {
  const context = React.useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within the app global provider');
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const PermissionContextProvider: React.FC<IProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<IPermissionModule[]>([]);
  const [userAccess, setUserAccess] = useState<IPermissionModule[]>([]);
  const permissionQ = usePermissionQuery();
  const { data } = useSession();

  useEffect(() => {
    if (data?.user) {
      findUserAccess();
    }
  }, [(data?.user as any)?.id]);

  const findPermissionModules = async (query: IPermissionModuleQueryInput) => {
    return permissionQ
      .find({
        variables: { query }
      })
      .then((res) => {
        const data = res?.data?.findPermissionModules;
        if (data) {
          let p = data?.data?.map((item: any) => ({
            _id: item?._id,
            createdAt: item?.createdAt,
            name: item?.name,
            updatedAt: item?.updatedAt,
            children: item?.actions
          }));

          setPermissions(p);
        }
      });
  };

  const addOrUpdatePermission = async (permission: ICreatePermissionInput) => {
    return permissionQ
      .update({
        variables: { permission }
      })
      .then((res) => {
        const data = res?.data?.addOrUpdatePermission;
        if (data) {
          toastSvc.success('Permission Updated');
          findPermissionModules({ groupId: permission.groupId });
        }
      });
  };

  const findUserAccess = async () => {
    return permissionQ.userAccess().then((res) => {
      const data = res?.data?.findUserAccess;
      if (data) {
        let p = data?.data?.map((item: any) => ({
          _id: item?._id,
          createdAt: item?.createdAt,
          name: item?.name,
          updatedAt: item?.updatedAt,
          children: item?.actions
        }));

        setUserAccess(p);
      }
    });
  };

  const haveViewAccess = (module: string, component: any, action: string = 'view') => {
    return haveAccess(module, component, action);
  };

  const haveAccess = (module: string, component: any, action: string = 'view') => {
    if (!module) {
      return component;
    }

    if (userAccess.length === 0) {
      return null;
    }

    const moduleAccess = userAccess.find((x) => x.name?.toLowerCase() === module?.toLowerCase());

    if (!moduleAccess || !moduleAccess?.children) {
      return null;
    }

    const actn = moduleAccess?.children?.find(
      (x) => x.name?.toLowerCase() === action?.toLowerCase()
    );

    // console.log('actn', actn);

    if (!actn || !actn?.hasPermission) {
      return null;
    }

    return component;
  };

  const updateAllPermision = async (data: IUpdatePermissionInput) => {
    const payload = {
      groupId: data.groupId,
      action: data.action,
      moduleId: data.moduleId
    };

    return permissionQ
      .updateAllPermission({
        variables: { permission: payload }
      })
      .then((res) => {
        const responseData = res?.data?.updateAllPermission;
        if (responseData) {
          toastSvc.success('Permission Updated');
          findPermissionModules({ groupId: data.groupId });
        }
      });
  };

  return (
    <PermissionContext.Provider
      value={{
        initLoading: permissionQ.initLoading,
        permissions,
        userAccess,
        findUserAccess,
        haveAccess,
        haveViewAccess,
        addOrUpdatePermission,
        findPermissionModules,
        updateAllPermision
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
