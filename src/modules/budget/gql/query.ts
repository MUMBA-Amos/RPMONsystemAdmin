import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { BudgetFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const BUDGET_PAGE = gql`
  query budgetPage($page: BudgetPageInput!) {
    budgetPage(page: $page) {
      totalRecords
      data {
        ...Budget
      }
    }
  }
  ${BudgetFragment}
`;

const CREATE_BUDGET = gql`
  mutation createBudget($budget: CreateBudgetInput!) {
    createBudget(budget: $budget) {
      ...Budget
    }
  }
  ${BudgetFragment}
`;

const UPDATE_BUDGET = gql`
  mutation updateBudget($_id: String!, $budget: UpdateBudgetInput!) {
    updateBudget(_id: $_id, budget: $budget) {
      ...Budget
    }
  }
  ${BudgetFragment}
`;

const DELETE_BUDGET = gql`
  mutation deleteBudget($_id: String!) {
    deleteBudget(_id: $_id)
  }
`;

const FIND_BUDGET = gql`
  query findOneBudget($budget: BudgetQueryInput!) {
    findOneBudget(budget: $budget) {
      ...Budget
    }
  }
  ${BudgetFragment}
`;


export const findBudgetAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_BUDGET, { budget: { _id } })
    .then((res: any) => {
      return res.findOneBudget;
    });
};

export const useBudgetQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(BUDGET_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_BUDGET, { onError });
  const update = useMutation(UPDATE_BUDGET, { onError });
  const remove = useMutation(DELETE_BUDGET, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
