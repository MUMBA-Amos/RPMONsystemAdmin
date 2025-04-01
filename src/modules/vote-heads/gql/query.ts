import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '@/services';
import { VoteHeadFragment } from './fragment';
import { getGqlClient } from '../../../ApolloClient';

const VOTEHEADER_PAGE = gql`
  query voteHeadPage($page: VoteHeadPageInput!) {
    voteHeadPage(page: $page) {
      totalRecords
      data {
        ...VoteHead
      }
    }
  }
  ${VoteHeadFragment}
`;

const CREATE_VOTEHEADER = gql`
  mutation createVoteHead($voteHead : CreateVoteHeadInput!) {
    createVoteHead(voteHead : $voteHead ) {
      ...VoteHead
    }
  }
  ${VoteHeadFragment}
`;

const UPDATE_VOTEHEADER = gql`
  mutation updateVoteHead($_id: String!, $voteHead : UpdateVoteHeadInput!) {
    updateVoteHead(_id: $_id, voteHead : $voteHead ) {
      ...VoteHead
    }
  }
  ${VoteHeadFragment}
`;

const DELETE_VOTEHEADER = gql`
  mutation deleteVoteHead($_id: String!) {
    deleteVoteHead(_id: $_id)
  }
`;

const FIND_VOTEHEADER = gql`
  query findOneVoteHead($voteHead : VoteHeadQueryInput!) {
    findOneVoteHead(voteHead : $voteHead ) {
      ...VoteHead
    }
  }
  ${VoteHeadFragment}
`;

export const useVoteHeadQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(VOTEHEADER_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });
  const findOne = useLazyQuery(FIND_VOTEHEADER, { fetchPolicy: 'no-cache', onError });

  const create = useMutation(CREATE_VOTEHEADER, { onError });
  const update = useMutation(UPDATE_VOTEHEADER, { onError });
  const remove = useMutation(DELETE_VOTEHEADER, { onError });

  return {
    page: page[0],
    findOne: findOne[0],
    create: create[0],
    update: update[0],
    remove: remove[0]
  };
};

export const findOneVoteHeadAsync = async (_id: string) => {
  return await getGqlClient()
    .request(FIND_VOTEHEADER, { voteHead : { _id } })
    .then((res: any) => {
      return res?.findOneVoteHead;
    });
};
