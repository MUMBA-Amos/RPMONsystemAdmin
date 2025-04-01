import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ReviewerFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const REVIEWER_PAGE = gql`
  query reviewerPage($page: ReviewerPageInput!) {
    reviewerPage(page: $page) {
      totalRecords
      data {
        ...Reviewer
      }
    }
  }
  ${ReviewerFragment}
`;

const CREATE_REVIEWER = gql`
  mutation createReviewer($reviewer: CreateReviewerInput!) {
    createReviewer(reviewer: $reviewer) {
      ...Reviewer
    }
  }
  ${ReviewerFragment}
`;

const UPDATE_REVIEWER = gql`
  mutation updateReviewer($_id: String!, $reviewer: UpdateReviewerInput!) {
    updateReviewer(_id: $_id, reviewer: $reviewer) {
      ...Reviewer
    }
  }
  ${ReviewerFragment}
`;

const DELETE_REVIEWER = gql`
  mutation deleteReviewer($_id: String!) {
    deleteReviewer(_id: $_id)
  }
`;

const FIND_REVIEWER = gql`
  query findOneReviewer($reviewer: ReviewerQueryInput!) {
    findOneReviewer(reviewer: $reviewer) {
      ...Reviewer
    }
  }
  ${ReviewerFragment}
`;


export const findReviewerAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_REVIEWER, { reviewer: { _id } })
    .then((res: any) => {
      return res.findOneReviewer;
    });
};

export const useReviewerQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(REVIEWER_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_REVIEWER, { onError });
  const update = useMutation(UPDATE_REVIEWER, { onError });
  const remove = useMutation(DELETE_REVIEWER, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
