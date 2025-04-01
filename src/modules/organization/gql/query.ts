import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { OrganizationFragment } from './fragment';
import { toastSvc } from '@/services';

const ORGANIZATION_PAGE = gql`
  query organizationPage($page: OrganizationPageInput!) {
    organizationPage(page: $page) {
      totalRecords
      data {
        ...Organization
      }
    }
  }
  ${OrganizationFragment}
`;

const CREATE_ORGANIZATION = gql`
  mutation createOrganization($organization: CreateOrganizationInput!) {
    createOrganization(organization: $organization) {
      ...Organization
    }
  }
  ${OrganizationFragment}
`;

const UPDATE_ORGANIZATION = gql`
  mutation updateOrganization($_id: String!, $organization: UpdateOrganizationInput!) {
    updateOrganization(_id: $_id, organization: $organization) {
      ...Organization
    }
  }
  ${OrganizationFragment}
`;


const DELETE_ORGANIZATION = gql`
  mutation deleteOrganization($_id: String!) {
    deleteOrganization(_id: $_id) 
  }
`;

export const useOrganizationQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(ORGANIZATION_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });

  const create = useMutation(CREATE_ORGANIZATION, { onError });
  const update = useMutation(UPDATE_ORGANIZATION, { onError });
  const remove = useMutation(DELETE_ORGANIZATION, { onError });
  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
