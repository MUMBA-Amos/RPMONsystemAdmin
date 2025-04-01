import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ResearchFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const RESEARCH_PAGE = gql`
  query researchPage($page: ResearchPageInput!) {
    researchPage(page: $page) {
      totalRecords
      data {
        ...Research
      }
    }
  }
  ${ResearchFragment}
`;

const CREATE_RESEARCH = gql`
  mutation createResearch($research: CreateResearchInput!) {
    createResearch(research: $research) {
      ...Research
    }
  }
  ${ResearchFragment}
`;

const UPDATE_RESEARCH = gql`
  mutation updateResearch($_id: String!, $research: UpdateResearchInput!) {
    updateResearch(_id: $_id, research: $research) {
      ...Research
    }
  }
  ${ResearchFragment}
`;

const DELETE_RESEARCH = gql`
  mutation deleteResearch($_id: String!) {
    deleteResearch(_id: $_id)
  }
`;

const FIND_RESEARCH = gql`
  query findOneResearch($research: ResearchQueryInput!) {
    findOneResearch(research: $research) {
      ...Research
    }
  }
  ${ResearchFragment}
`;


export const findResearchAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_RESEARCH, { research: { _id } })
    .then((res: any) => {
      return res.findOneResearch;
    });
};

export const useResearchQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(RESEARCH_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_RESEARCH, { onError });
  const update = useMutation(UPDATE_RESEARCH, { onError });
  const remove = useMutation(DELETE_RESEARCH, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
