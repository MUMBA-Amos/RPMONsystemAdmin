import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { SignoffFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const SIGNOFF_PAGE = gql`
  query signoffPage($page: SignoffPageInput!) {
    signoffPage(page: $page) {
      totalRecords
      data {
        ...Signoff
      }
    }
  }
  ${SignoffFragment}
`;

const CREATE_SIGNOFF = gql`
  mutation createSignoff($signoff: CreateSignoffInput!) {
    createSignoff(signoff: $signoff) {
      ...Signoff
    }
  }
  ${SignoffFragment}
`;

const UPDATE_SIGNOFF = gql`
  mutation updateSignoff($_id: String!, $signoff: UpdateSignoffInput!) {
    updateSignoff(_id: $_id, signoff: $signoff) {
      ...Signoff
    }
  }
  ${SignoffFragment}
`;

const DELETE_SIGNOFF = gql`
  mutation deleteSignoff($_id: String!) {
    deleteSignoff(_id: $_id)
  }
`;

const FIND_SIGNOFF = gql`
  query findOneSignoff($signoff: SignoffQueryInput!) {
    findOneSignoff(signoff: $signoff) {
      ...Signoff
    }
  }
  ${SignoffFragment}
`;


export const findSignoffAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_SIGNOFF, { signoff: { _id } })
    .then((res: any) => {
      return res.findOneSignoff;
    });
};

export const useSignoffQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(SIGNOFF_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_SIGNOFF, { onError });
  const update = useMutation(UPDATE_SIGNOFF, { onError });
  const remove = useMutation(DELETE_SIGNOFF, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
