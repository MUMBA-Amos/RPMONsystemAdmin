import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { GrantFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const GRANT_PAGE = gql`
  query grantPage($page: GrantPageInput!) {
    grantPage(page: $page) {
      totalRecords
      data {
        ...Grant
      }
    }
  }
  ${GrantFragment}
`;

const CREATE_GRANT = gql`
  mutation createGrant($grant: CreateGrantInput!) {
    createGrant(grant: $grant) {
      ...Grant
    }
  }
  ${GrantFragment}
`;

const UPDATE_GRANT = gql`
  mutation updateGrant($_id: String!, $grant: UpdateGrantInput!) {
    updateGrant(_id: $_id, grant: $grant) {
      ...Grant
    }
  }
  ${GrantFragment}
`;

const DELETE_GRANT = gql`
  mutation deleteGrant($_id: String!) {
    deleteGrant(_id: $_id)
  }
`;

const FIND_GRANT = gql`
  query findOneGrant($grant: GrantQueryInput!) {
    findOneGrant(grant: $grant) {
      ...Grant
    }
  }
  ${GrantFragment}
`;


export const findGrantAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_GRANT, { grant: { _id } })
    .then((res: any) => {
      return res.findOneGrant;
    });
};

export const useGrantQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(GRANT_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_GRANT, { onError });
  const update = useMutation(UPDATE_GRANT, { onError });
  const remove = useMutation(DELETE_GRANT, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
