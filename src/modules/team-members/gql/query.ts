import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { TeamMemberFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const TEAM_MEMBER_PAGE = gql`
  query teamMemberPage($page: TeamMemberPageInput!) {
    teamMemberPage(page: $page) {
      totalRecords
      data {
        ...TeamMember
      }
    }
  }
  ${TeamMemberFragment}
`;

const CREATE_TEAM_MEMBER = gql`
  mutation createTeamMember($teamMember: CreateTeamMemberInput!) {
    createTeamMember(teamMember: $teamMember) {
      ...TeamMember
    }
  }
  ${TeamMemberFragment}
`;

const UPDATE_TEAM_MEMBER = gql`
  mutation updateTeamMember($_id: String!, $teamMember: UpdateTeamMemberInput!) {
    updateTeamMember(_id: $_id, teamMember: $teamMember) {
      ...TeamMember
    }
  }
  ${TeamMemberFragment}
`;

const DELETE_TEAM_MEMBER = gql`
  mutation deleteTeamMember($_id: String!) {
    deleteTeamMember(_id: $_id)
  }
`;

const FIND_TEAM_MEMBER = gql`
  query findOneTeamMember($teamMember: TeamMemberQueryInput!) {
    findOneTeamMember(teamMember: $teamMember) {
      ...TeamMember
    }
  }
  ${TeamMemberFragment}
`;


export const findTeamMemberAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient()

  return gqlClient
    // .setHeader("Authorization", `Bearer ${token}`)
    .request(FIND_TEAM_MEMBER, { teamMember: { _id } })
    .then((res: any) => {
      return res.findOneTeamMember;
    });
};

export const useTeamMemberQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(TEAM_MEMBER_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_TEAM_MEMBER, { onError });
  const update = useMutation(UPDATE_TEAM_MEMBER, { onError });
  const remove = useMutation(DELETE_TEAM_MEMBER, { onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};
