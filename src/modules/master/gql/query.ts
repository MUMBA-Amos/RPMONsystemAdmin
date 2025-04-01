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

export const useCreateMaster = (callback: any) => {
  return useMutation(CREATE_MASTER, {
    onCompleted: (res) => {
      if (res.createMaster) {
        callback(res.createMaster);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
};

const UPDATE_MASTER = gql`
  mutation updateMaster($id: String!, $master: UpdateMasterInput!) {
    updateMaster(id: $id, master: $master) {
      ...Master
    }
  }
  ${MasterFragment}
`;

export const useUpdateMaster = (callback: (data: any) => void) => {
  return useMutation(UPDATE_MASTER, {
    onCompleted: (res) => {
      if (res.updateMaster) {
        callback(res.updateMaster);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
};

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

export const useLazyMasterPage = (callback: (data: any) => void) => {
  return useLazyQuery(MASTER_PAGE, {
    fetchPolicy: 'no-cache',
    onCompleted: (res) => {
      if (res?.masterPage) {
        callback(res?.masterPage);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
};

const DELETE_MASTER = gql`
  mutation deleteMaster($id: String!) {
    deleteMaster(id: $id)
  }
`;

export const useDeleteMaster = (callback: (data: any) => void) => {
  return useMutation(DELETE_MASTER, {
    onCompleted: (res) => {
      if (res.deleteMaster) {
        callback(res.deleteMaster);
      }
    },
    onError: (err) => {
      toastSvc.graphQlError(err);
    }
  });
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
