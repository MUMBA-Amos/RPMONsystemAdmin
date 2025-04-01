import gql from 'graphql-tag';

export const BudgetFragment = gql`
  fragment Budget on Budget {
    _id
    applicationId
    reportId
    year
    voteHeads {
      voteHeadId
      description
      voteHead {
        _id
        name
        amount
      }
    }
  }
`;
