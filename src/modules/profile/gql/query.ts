import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '../../../services';
import { UserFragment } from './fragment';
import { getGqlClient } from '../../../ApolloClient';

const PROFILE_PAGE = gql`
  query currentUser {
    currentUser {
      ...User
    }
  }
  ${UserFragment}
`;

export const useProfilePage = (onCompleted: any) => {
  return useLazyQuery(PROFILE_PAGE, {
    fetchPolicy: 'no-cache',
    onCompleted: (res) => {
      if (res.currentUser) {
        onCompleted(res.currentUser);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
};

const UPDATE_PROFILE = gql`
  mutation updateUser($account: UpdateUserInput!) {
    updateUser(account: $account) {
      ...User
    }
  }
  ${UserFragment}
`;

export const useUpdateProfile = (callback: any) => {
  return useMutation(UPDATE_PROFILE, {
    onCompleted: (res) => {
      if (res?.updateUser) {
        callback(res.updateUser);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
};

export const findCurrentUserAsync = async (token: string) => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(PROFILE_PAGE, {})
    .then((res: any) => {
      return res.currentUser;
    });
};

const CHANGE_PASSWORD = gql`
  mutation changePassword($password: ChangePasswordInput!) {
    changePassword(password: $password)
  }
`;

export const useChangePassword = (callback: any) => {
  return useMutation(CHANGE_PASSWORD, {
    onCompleted: (res) => {
      if (res.changePassword) {
        callback(res.changePassword);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
};
