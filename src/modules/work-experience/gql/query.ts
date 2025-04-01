import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { WorkExperienceFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const WORK_EXPERIENCE_PAGE = gql`
  query workExperiencePage($page: WorkExperiencePageInput!) {
    workExperiencePage(page: $page) {
      totalRecords
      data {
        ...WorkExperience
      }
    }
  }
  ${WorkExperienceFragment}
`;

const CREATE_WORK_EXPERIENCE = gql`
  mutation createWorkExperience($workExperience: WorkExperienceCommonInput!) {
    createWorkExperience(workExperience: $workExperience) {
      ...WorkExperience
    }
  }
  ${WorkExperienceFragment}
`;

const UPDATE_WORK_EXPERIENCE = gql`
  mutation updateWorkExperience($_id: String!, $workExperience: WorkExperienceQueryInput!) {
    updateWorkExperience(_id: $_id, workExperience: $workExperience) {
      ...WorkExperience
    }
  }
  ${WorkExperienceFragment}
`;

const DELETE_WORK_EXPERIENCE = gql`
  mutation deleteWorkExperience($_id: String!) {
    deleteWorkExperience(_id: $_id)
  }
`;

const FIND_WORK_EXPERIENCE = gql`
  query findOneWorkExperience($workExperience: WorkExperienceQueryInput!) {
    findOneWorkExperience(workExperience: $workExperience) {
      ...WorkExperience
    }
  }
  ${WorkExperienceFragment}
`;


export const findWorkExperienceAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_WORK_EXPERIENCE, { workExperience: { _id } })
    .then((res: any) => {
      return res.findOneWorkExperience;
    });
};

export const useWorkExperienceQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(WORK_EXPERIENCE_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_WORK_EXPERIENCE, { onError });
  const update = useMutation(UPDATE_WORK_EXPERIENCE, { onError });
  const remove = useMutation(DELETE_WORK_EXPERIENCE, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
