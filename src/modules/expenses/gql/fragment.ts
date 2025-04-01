import gql from 'graphql-tag';

export const ExpenseFragment = gql`
  fragment Expense on Expense {
    _id
    voteheadId
    applicationId
    reportId
    quantity
    vendor
    description
    invoiceDate
    invoiceNumber
    invoiceAmount
    origin
    paymentAmount
    paymentDate
    milestone
    voteHead{
      _id
      name
    }
    application {
      _id
    }
  }
`;
