import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { PublicationFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const PUBLICATION_PAGE = gql`
  query publicationPage($page: PublicationPageInput!) {
    publicationPage(page: $page) {
      totalRecords
      data {
        ...Publication
      }
    }
  }
  ${PublicationFragment}
`;

const CREATE_PUBLICATION = gql`
  mutation createPublication($publication: CreatePublicationInput!) {
    createPublication(publication: $publication) {
      ...Publication
    }
  }
  ${PublicationFragment}
`;

const UPDATE_PUBLICATION = gql`
  mutation updatePublication($_id: String!, $publication: UpdatePublicationInput!) {
    updatePublication(_id: $_id, publication: $publication) {
      ...Publication
    }
  }
  ${PublicationFragment}
`;

const DELETE_PUBLICATION = gql`
  mutation deletePublication($_id: String!) {
    deletePublication(_id: $_id)
  }
`;

const FIND_PUBLICATION = gql`
  query findOnePublication($publication: PublicationQueryInput!) {
    findOnePublication(publication: $publication) {
      ...Publication
    }
  }
  ${PublicationFragment}
`;


export const findPublicationAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_PUBLICATION, { publication: { _id } })
    .then((res: any) => {
      return res.findOnePublication;
    });
};

export const usePublicationQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(PUBLICATION_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_PUBLICATION, { onError });
  const update = useMutation(UPDATE_PUBLICATION, { onError });
  const remove = useMutation(DELETE_PUBLICATION, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
