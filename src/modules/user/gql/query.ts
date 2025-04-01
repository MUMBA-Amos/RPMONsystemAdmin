import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { toastSvc } from "../../../services";
import { UserFragment } from "@/modules/profile/gql/fragment";

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


export const useUserQuery = () => {
  const onError = (err: any) => {
    toastSvc.graphQlError(err);
  };

  const page = useLazyQuery(USER_PAGE, {
    fetchPolicy: "no-cache",
    onError,
  });

  const findOne = useLazyQuery(FIND_ONE, {
    fetchPolicy: "no-cache",
    onError,
  });

  return {
    loading: page[1].loading,
    page: page[0],
    findOne: findOne[0],
  };
};
