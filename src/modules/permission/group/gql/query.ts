import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { AccessGroupFragment } from "./fragment";
import { toastSvc } from "../../../../services";
import {getGqlClient} from "../../../../ApolloClient";

const FIND_ACCESS_GROUPS = gql`
  query FindAccessGroups($query: AccessGroupQueryInput!) {
    findAccessGroups(query: $query) {
      ...AccessGroup
    }
  }
  ${AccessGroupFragment}
`;

const CREATE_ACCESS_GROUP = gql`
  mutation CreateAccessGroup($accessGroup: CreateAccessGroupInput!) {
    createAccessGroup(accessGroup: $accessGroup){
      _id
    }
  }
`;

const UPDATE_ACCESS_GROUP = gql`
  mutation UpdateAccessGroup($_id: String!, $accessGroup: UpdateAccessGroupInput!) {
    updateAccessGroup(_id: $_id, accessGroup: $accessGroup)
  }
`;

const DELETE_ACCESS_GROUP = gql`
  mutation DeleteAccessGroup($_id: String!) {
    deleteAccessGroup(_id: $_id)
  }
`;

export const useAccessGroupsQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const findAccessGroupsQ = useLazyQuery(FIND_ACCESS_GROUPS, {
    fetchPolicy: "no-cache",
    onError,
  });

  const createAccessGroupQ = useMutation(CREATE_ACCESS_GROUP, {onError})
  const updateAccessGroupQ = useMutation(UPDATE_ACCESS_GROUP, {onError})
  const deleteAccessGroupQ = useMutation(DELETE_ACCESS_GROUP, {onError})

  return {
    initLoading:
      findAccessGroupsQ[1].loading,
    loading: 
      createAccessGroupQ[1].loading 
      || deleteAccessGroupQ[1].loading 
      || updateAccessGroupQ[1].loading,
    findAccessGroupsQ,
    createAccessGroupQ,
    updateAccessGroupQ,
    deleteAccessGroupQ
  };
};