import { getGqlClient } from '@/ApolloClient';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '../../../services';
import { ICheckAcessInput } from '../model';
import { PermissionModuleFragment } from './fragment';

const FIND_PERMISSION_MODULES = gql`
  query FindPermissionModules($query: PermissionModuleQueryInput!) {
    findPermissionModules(query: $query) {
      groupId
      data {
        ...PermissionModule
      }
    }
  }
  ${PermissionModuleFragment}
`;

const USER_ACCESSS = gql`
  query findUserAccess {
    findUserAccess {
      groupId
      data {
        ...PermissionModule
      }
    }
  }
  ${PermissionModuleFragment}
`;

const ADD_OR_UPDATE_PERMISSION = gql`
  mutation AddOrUpdatePermission($permission: CreatePermissionInput!) {
    addOrUpdatePermission(permission: $permission)
  }
`;

const HAVE_ACCESS = gql`
  query haveAccess($access: HaveAccessInput!) {
    haveAccess(access: $access)
  }
`;

const UPDATE_ALL_PERMISSIONS = gql`
  mutation updateAllPermission($permission: UpdateAllInput!) {
    updateAllPermission(permission: $permission)
  }
`;

export const usePermissionQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const find = useLazyQuery(FIND_PERMISSION_MODULES, {
    fetchPolicy: 'no-cache',
    onError
  });

  const userAccess = useLazyQuery(USER_ACCESSS, {
    fetchPolicy: 'no-cache',
    onError
  });

  const updateAllPermission = useMutation(UPDATE_ALL_PERMISSIONS, {
    onError
  });

  const update = useMutation(ADD_OR_UPDATE_PERMISSION, {
    onError
  });

  return {
    find: find[0],
    update: update[0],
    userAccess: userAccess[0],
    initLoading: find[1].loading || update[1].loading || userAccess[1].loading,
    updateAllPermission: updateAllPermission[0]
  };
};

export const checkAccessAsync = async (access: ICheckAcessInput, req: any, token?: string) => {
  try {
    return await getGqlClient()
      .setHeader('Authorization', `Bearer ${token}`)
      .request(HAVE_ACCESS, { access })
      .then((res: any) => {
        return res?.haveAccess;
      });
  } catch (e) {
    console.log(e);
  }
};
