import gql from 'graphql-tag';

export const VoteHeadFragment = gql`
  fragment VoteHead on VoteHead {
    _id
    name
    description
    amount
    createdAt
  }
`;
