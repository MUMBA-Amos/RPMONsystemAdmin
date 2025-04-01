import gql from 'graphql-tag';

export const OrganizationFragment = gql`
  fragment Organization on Organization {
    _id
    ref
    name
    email
    phone
    address
    createdAt
  }
`;
