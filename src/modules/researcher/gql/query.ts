import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ResearcherFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const RESEARCHER_PAGE = gql`
  query researcherPage($page: ResearcherPageInput!) {
    researcherPage(page: $page) {
      totalRecords
      data {
        ...Researcher
      }
    }
  }
  ${ResearcherFragment}
`;

const CREATE_RESEARCHER = gql`
  mutation createResearcher($Researcher: ResearcherCommonInput!) {
    createResearcher(Researcher: $Researcher) {
      ...Researcher
    }
  }
  ${ResearcherFragment}
`;

const UPDATE_RESEARCHER = gql`
  mutation updateResearcher($_id: String!, $researcher: ResearcherQueryInput!) {
    updateResearcher(_id: $_id, researcher: $researcher) {
      ...Researcher
    }
  }
  ${ResearcherFragment}
`;

const DELETE_RESEARCHER = gql`
  mutation deleteResearcher($_id: String!) {
    deleteResearcher(_id: $_id)
  }
`;

const FIND_RESEARCHER = gql`
  query findOneResearcher($researcher: ResearcherQueryInput!) {
    findOneResearcher(researcher: $researcher) {
      ...Researcher
    }
  }
  ${ResearcherFragment}
`;


export const findResearcherAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_RESEARCHER, { researcher: { _id } })
    .then((res: any) => {
      return res.findOneResearcher;
    });
};

export const useResearcherQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(RESEARCHER_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_RESEARCHER, { onError });
  const update = useMutation(UPDATE_RESEARCHER, { onError });
  const remove = useMutation(DELETE_RESEARCHER, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
