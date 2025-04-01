import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '@/services';
import { InviteFragment } from './fragment';
import { getGqlClient } from '../../../ApolloClient';

const INVITE_PAGE = gql`
  query invitePage($page: InvitePageInput!) {
    invitePage(page: $page) {
      totalRecords
      data {
        ...Invite
      }
    }
  }
  ${InviteFragment}
`;

const CREATE_INVITE = gql`
  mutation createInvite($invite: CreateInviteInput!) {
    createInvite(invite: $invite) {
      ...Invite
    }
  }
  ${InviteFragment}
`;

const UPDATE_INVITE = gql`
  mutation updateInvite($_id: String!, $invite: UpdateInviteInput!) {
    updateInvite(_id: $_id, invite: $invite) {
      ...Invite
    }
  }
  ${InviteFragment}
`;

const DELETE_INVITE = gql`
  mutation deleteInvite($_id: String!) {
    deleteInvite(_id: $_id)
  }
`;

const FIND_INVITE = gql`
  query findOneInvite($invite: InviteQueryInput!) {
    findOneInvite(invite: $invite) {
      ...Invite
    }
  }
  ${InviteFragment}
`;

export const useInviteQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(INVITE_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });
  const findOne = useLazyQuery(FIND_INVITE, { fetchPolicy: 'no-cache', onError });

  const create = useMutation(CREATE_INVITE, { onError });
  const update = useMutation(UPDATE_INVITE, { onError });
  const remove = useMutation(DELETE_INVITE, { onError });

  return {
    page: page[0],
    findOne: findOne[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};

export const findOneInviteAsync = async (_id: string) => {
  return await getGqlClient()
    .request(FIND_INVITE, { invite: { _id } })
    .then((res: any) => {
      return res?.findOneInvite;
    }).catch((error: any) => {
      console.error(error);
      // throw error;
    });
};
