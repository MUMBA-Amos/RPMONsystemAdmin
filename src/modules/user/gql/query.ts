import { useLazyQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { toastSvc } from '../../../services';
import { UserFragment } from './fragment';

const USER_PAGE = gql`
  query userPage($page: UserPageInput!) {
    userPage(page: $page) {
      totalRecords
      data {
        ...User
      }
    }
  }
  ${UserFragment}
`;

const FIND_ONE = gql`
  query findOneUser($user: UserQueryInput!) {
    findOneUser(user: $user) {
      ...User
    }
  }
  ${UserFragment}
`;

const UPDATE_USER = gql`
  mutation updateUser($_id: String!, $user: UpdateUserInput!) {
    updateUser(_id: $_id, user: $user) {
      ...User
    }
  }
  ${UserFragment}
`;

export const useUserQuery = () => {
  const onError = (err: any) => {
    toastSvc.graphQlError(err);
  };

  const page = useLazyQuery(USER_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });

  const findOne = useLazyQuery(FIND_ONE, {
    fetchPolicy: 'no-cache',
    onError
  });

  const update = useMutation(UPDATE_USER, { onError });

  return {
    page: page[0],
    findOne: findOne[0],
    update: update[0]
  };
};
