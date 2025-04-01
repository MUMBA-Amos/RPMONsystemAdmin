import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ExpenseFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const EXPENSE_PAGE = gql`
  query expensePage($page: ExpensePageInput!) {
    expensePage(page: $page) {
      totalRecords
      data {
        ...Expense
      }
    }
  }
  ${ExpenseFragment}
`;

const CREATE_EXPENSE = gql`
  mutation createExpenses($expense: CreateExpenseInput!) {
    createExpenses(expense: $expense) {
      ...Expense
    }
  }
  ${ExpenseFragment}
`;

const UPDATE_EXPENSE = gql`
  mutation updateExpense($_id: String!, $expense: UpdateExpenseInput!) {
    updateExpense(_id: $_id, expense: $expense) {
      ...Expense
    }
  }
  ${ExpenseFragment}
`;

const DELETE_EXPENSE = gql`
  mutation deleteExpenses($_id: String!) {
    deleteExpenses(_id: $_id)
  }
`;

const FIND_EXPENSE = gql`
  query findOneExpense($expense: ExpenseQueryInput!) {
    findOneExpense(expense: $expense) {
      ...Expense
    }
  }
  ${ExpenseFragment}
`;


export const findExpenseAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_EXPENSE, { expense: { _id } })
    .then((res: any) => {
      return res.findOneExpense;
    });
};

export const useExpenseQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(EXPENSE_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_EXPENSE, { onError });
  const update = useMutation(UPDATE_EXPENSE, { onError });
  const remove = useMutation(DELETE_EXPENSE, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
