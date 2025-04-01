import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { CommentFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const COMMENT_PAGE = gql`
  query commentPage($page: CommentPageInput!) {
    commentPage(page: $page) {
      totalRecords
      data {
        ...Comment
      }
    }
  }
  ${CommentFragment}
`;

const CREATE_COMMENT = gql`
  mutation createComment($comment: CreateCommentInput!) {
    createComment(comment: $comment) {
      ...Comment
    }
  }
  ${CommentFragment}
`;

const UPDATE_COMMENT = gql`
  mutation updateComment($_id: String!, $comment: UpdateCommentInput!) {
    updateComment(_id: $_id, comment: $comment) {
      ...Comment
    }
  }
  ${CommentFragment}
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($_id: String!) {
    deleteComment(_id: $_id)
  }
`;

export const useCommentQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(COMMENT_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_COMMENT, { onError });
  const update = useMutation(UPDATE_COMMENT, { onError });
  const remove = useMutation(DELETE_COMMENT, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
