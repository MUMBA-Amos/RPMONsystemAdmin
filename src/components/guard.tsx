import { useSession } from 'next-auth/react';
import React, { createContext } from 'react';
import { ApRoleTypes } from '../constants';
import { usePermissionState } from '@/modules/permission/context';

interface IProps {
  roles?: Array<ApRoleTypes>;
  allExcept?: Array<ApRoleTypes>;
  children: React.ReactNode;
}

export const ApGuard: React.FC<IProps> = ({ roles, children, allExcept }) => {
  const { data: session } = useSession();
  const user: any = session?.user;

  return (
    <>
      {roles && roles?.filter((r) => user?.roles?.includes(r)).length > 0
        ? children
        : allExcept && allExcept?.filter((r) => !user?.roles?.includes(r)).length > 0 && children}
    </>
  );
};

interface IProp2 {
  module: string;
  action: string;
  children: React.ReactNode;
}

export const ApAccessGuard: React.FC<IProp2> = ({ module, action, children }) => {
  const { haveAccess } = usePermissionState();
  return <>{haveAccess(module, children, action)} </>;
};
