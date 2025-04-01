import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ApplicationFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const APPLICATION_PAGE = gql`
  query applicationPage($page: ApplicationPageInput!) {
    applicationPage(page: $page) {
      totalRecords
      data {
        ...Application
      }
    }
  }
  ${ApplicationFragment}
`;

const CREATE_APPLICATION = gql`
  mutation createApplication($application: CreateApplicationInput!) {
    createApplication(application: $application) {
      ...Application
    }
  }
  ${ApplicationFragment}
`;

const UPDATE_APPLICATION = gql`
  mutation updateApplication($_id: String!, $application: UpdateApplicationInput!) {
    updateApplication(_id: $_id, application: $application) {
      ...Application
    }
  }
  ${ApplicationFragment}
`;

const UPDATE_STATUS = gql`
  mutation updateApplicationStatus($status: UpdateApplicationStatusInput!) {
    updateApplicationStatus(status: $status) {
      ...Application
    }
  }
  ${ApplicationFragment}
`;

const DELETE_APPLICATION = gql`
  mutation deleteApplication($_id: String!) {
    deleteApplication(_id: $_id)
  }
`;

const FIND_APPLICATION = gql`
  query findOneApplication($application: ApplicationQueryInput!) {
    findOneApplication(application: $application) {
      ...Application
    }
  }
  ${ApplicationFragment}
`;


export const findApplicationAsync = async (_id: string, token?: string) => {
  return getGqlClient()
    .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_APPLICATION, { application: { _id } })
    .then((res: any) => {
      return res?.findOneApplication;
    }).catch((error: any) => {
      console.error(`findApplicationAsync:`, error);
    });
};

export const useApplicationQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(APPLICATION_PAGE, { fetchPolicy: 'no-cache', onError });
  const find = useLazyQuery(FIND_APPLICATION, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_APPLICATION, { onError });
  const update = useMutation(UPDATE_APPLICATION, { onError });
  const remove = useMutation(DELETE_APPLICATION, { onError });
  const updateStatus = useMutation(UPDATE_STATUS, { onError });

  return {
    page: page[0],
    find: find[0],
    create: create[0],
    update: update[0],
    remove: remove[0],
    updateStatus: updateStatus[0]
  };
};
