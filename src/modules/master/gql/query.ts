import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { getGqlClient } from '../../../ApolloClient';
import { toastSvc } from '../../../services';
import { MasterFragment } from './fragment';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const CREATE_MASTER = gql`
  mutation createMaster($master: CreateMasterInput!) {
    createMaster(master: $master) {
      ...Master
    }
  }
  ${MasterFragment}
`;

const UPDATE_MASTER = gql`
  mutation updateMaster($id: String!, $master: UpdateMasterInput!) {
    updateMaster(id: $id, master: $master) {
      ...Master
    }
  }
  ${MasterFragment}
`;

const MASTER_PAGE = gql`
  query masterPage($page: MasterPageInput!) {
    masterPage(page: $page) {
      totalRecords
      data {
        ...Master
      }
    }
  }
  ${MasterFragment}
`;

export const fetchMasterPageAsync = async (token: string) => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(MASTER_PAGE, { page: { size: 0, take: DEFAULT_PAGE_SIZE } })
    .then((res: any) => {
      return res?.masterPage;
    });
};

const DELETE_MASTER = gql`
  mutation deleteMaster($id: String!) {
    deleteMaster(id: $id)
  }
`;

export const useMasterQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(MASTER_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_MASTER, { onError });
  const update = useMutation(UPDATE_MASTER, { onError });
  const remove = useMutation(DELETE_MASTER, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};

// const FIND_MASTER = gql`
//   query findPostById($id: String!) {
//     findPostById(id: $id) {
//       ...Post
//     }
//   }
//   ${MasterFragment}
// `;

// export const findMasterByIdAsync = async (postId: string) => {
//   return await gqlClient.request(FIND_MASTER, { id: postId }).then((res) => {
//     return res.findPostById;
//   });
// };
