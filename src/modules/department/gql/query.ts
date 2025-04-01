import gql from 'graphql-tag';
import { DepartmentFragment } from './fragment';
import { getGqlClient } from '../../../ApolloClient';
import { useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '../../../services';
import { IDepartmentQueryInput } from '../model';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const DEPARTMENT_PAGE = gql`
  query departmentPage($page: DepartmentPageInput!) {
    departmentPage(page: $page) {
      totalRecords
      data {
        ...Department
      }
    }
  }
  ${DepartmentFragment}
`;

const CREATE_DEPARTMENT = gql`
  mutation createDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      ...Department
    }
  }
  ${DepartmentFragment}
`;

const UPDATE_DEPARTMENT = gql`
  mutation updateDepartment($id: String!, $department: UpdateDepartmentInput!) {
    updateDepartment(id: $id, department: $department) {
      ...Department
    }
  }
  ${DepartmentFragment}
`;

const DELETE_DEPARTMENT = gql`
  mutation deleteDepartment($id: String!) {
    deleteDepartment(id: $id)
  }
`;

const FIND_DEPARTMENT = gql`
  query findDepartment($department: DepartmentQueryInput!) {
    findDepartment(department: $department) {
      ...Department
    }
  }
  ${DepartmentFragment}
`;

export const findDepartmentAsync = async (department: IDepartmentQueryInput, token: string) => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(FIND_DEPARTMENT, { department: { _id: department } })
    .then((res: any) => {
      return res?.findDepartment;
    });
};

export const fetchDepartmentPageAsync = async (token: string) => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(DEPARTMENT_PAGE, { page: { skip: 0, take: DEFAULT_PAGE_SIZE } })
    .then((res: any) => {
      return res?.departmentPage;
    });
};

export const useDepartmentQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(DEPARTMENT_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });

  const find = useLazyQuery(FIND_DEPARTMENT, { onError });
  const create = useMutation(CREATE_DEPARTMENT, { onError });
  const update = useMutation(UPDATE_DEPARTMENT, { onError });
  const remove = useMutation(DELETE_DEPARTMENT, { onError });
  return {
    find: find[0],
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
