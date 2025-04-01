import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { BatchFragment } from './fragment';
import { toastSvc } from '@/services';

const BATCH_PAGE = gql`
  query batchPage($page: BatchPageInput!) {
    batchPage(page: $page) {
      totalRecords
      data {
        ...Batch
      }
    }
  }
  ${BatchFragment}
`;

const CREATE_BATCH = gql`
  mutation createBatch($batch: CreateBatchInput!) {
    createBatch(batch: $batch) {
      ...Batch
    }
  }
  ${BatchFragment}
`;

const UPDATE_BATCH = gql`
  mutation updateBatch($_id: String!, $batch: UpdateBatchInput!) {
    updateBatch(_id: $_id, batch: $batch) {
      ...Batch
    }
  }
  ${BatchFragment}
`;

const DELETE_BATCH = gql`
  mutation deleteBatch($_id: String!) {
    deleteBatch(_id: $_id)
  }
`;

export const useBatchQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(BATCH_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_BATCH, { onError });
  const update = useMutation(UPDATE_BATCH, { onError });
  const remove = useMutation(DELETE_BATCH, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
