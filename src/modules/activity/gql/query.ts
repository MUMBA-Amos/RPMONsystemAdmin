import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ActivityFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const ACTIVITY_PAGE = gql`
  query activityPage($page: ActivityPageInput!) {
    activityPage(page: $page) {
      totalRecords
      data {
        ...Activity
      }
    }
  }
  ${ActivityFragment}
`;

const CREATE_ACTIVITY = gql`
  mutation createActivity($activity: CreateActivityInput!) {
    createActivity(activity: $activity) {
      ...Activity
    }
  }
  ${ActivityFragment}
`;

const UPDATE_ACTIVITY = gql`
  mutation updateActivity($_id: String!, $activity: UpdateActivityInput!) {
    updateActivity(_id: $_id, activity: $activity) {
      ...Activity
    }
  }
  ${ActivityFragment}
`;

const DELETE_ACTIVITY = gql`
  mutation deleteActivity($_id: String!) {
    deleteActivity(_id: $_id)
  }
`;

const FIND_ACTIVITY = gql`
  query findOneActivity($activity: ActivityQueryInput!) {
    findOneActivity(activity: $activity) {
      ...Activity
    }
  }
  ${ActivityFragment}
`;


export const findActivityAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_ACTIVITY, { activity: { _id } })
    .then((res: any) => {
      return res.findOneActivity;
    });
};

export const useActivityQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(ACTIVITY_PAGE, { fetchPolicy: 'no-cache', onError });
  const find = useLazyQuery(FIND_ACTIVITY, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_ACTIVITY, { onError });
  const update = useMutation(UPDATE_ACTIVITY, { onError });
  const remove = useMutation(DELETE_ACTIVITY, { onError });

  return {
    page: page[0],
    find: find[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
