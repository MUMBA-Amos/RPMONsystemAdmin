import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ExtenstionFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const EXTENSTION_PAGE = gql`
  query extenstionPage($page: ExtenstionPageInput!) {
    extenstionPage(page: $page) {
      totalRecords
      data {
        ...Extenstion
      }
    }
  }
  ${ExtenstionFragment}
`;

const CREATE_EXTENSTION = gql`
  mutation createExtenstion($extenstion: CreateExtenstionInput!) {
    createExtenstion(extenstion: $extenstion) {
      ...Extenstion
    }
  }
  ${ExtenstionFragment}
`;

const UPDATE_EXTENSTION = gql`
  mutation updateExtenstion($_id: String!, $extenstion: UpdateExtenstionInput!) {
    updateExtenstion(_id: $_id, extenstion: $extenstion) {
      ...Extenstion
    }
  }
  ${ExtenstionFragment}
`;

const UPDATE_STATUS = gql`
  mutation updateExtenstionStatus($status: UpdateExtenstionStatusInput!) {
    updateExtenstionStatus(status: $status) {
      ...Extenstion
    }
  }
  ${ExtenstionFragment}
`;

const DELETE_EXTENSTION = gql`
  mutation deleteExtenstion($_id: String!) {
    deleteExtenstion(_id: $_id)
  }
`;

const FIND_EXTENSTION = gql`
  query findOneExtenstion($extenstion: ExtenstionQueryInput!) {
    findOneExtenstion(extenstion: $extenstion) {
      ...Extenstion
    }
  }
  ${ExtenstionFragment}
`;


export const findExtenstionAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_EXTENSTION, { extenstion: { _id } })
    .then((res: any) => {
      return res.findOneExtenstion;
    });
};

export const useExtenstionQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(EXTENSTION_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_EXTENSTION, { onError });
  const update = useMutation(UPDATE_EXTENSTION, { onError });
  const remove = useMutation(DELETE_EXTENSTION, { onError });
  const updateStatus = useMutation(UPDATE_STATUS, { onError });
  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0],
    updateStatus: updateStatus[0],
  };
};
