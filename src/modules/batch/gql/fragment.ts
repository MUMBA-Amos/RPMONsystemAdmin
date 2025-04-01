import gql from 'graphql-tag';

export const BatchFragment = gql`
  fragment Batch on Batch {
    _id
    name
    description
  }
`;
