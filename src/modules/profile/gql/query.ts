import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '../../../services';
import { getGqlClient } from '../../../ApolloClient';
import { ProfileFragment } from './fragment';

const PROFILE_PAGE = gql`
  query currentUser {
    currentUser {
      ...User
    }
  }
  ${ProfileFragment}
`;

const CREATE_PROFILE = gql`
  mutation createProfile($profile: CreateProfileInput!) {
    createProfile(profile: $profile) {
      ...Profile
    }
  }
  ${ProfileFragment}
`;

const UPDATE_PROFILE = gql`
  mutation updateProfile($_id: String!, $profile: UpdateProfileInput!) {
    updateProfile(_id: $_id, profile: $profile) {
      _id
      ...Profile
    }
  }
  ${ProfileFragment}
`;

const FIND_PROFILE = gql`
  query findOneProfile($profile: ProfileQueryInput!) {
    findOneProfile(profile: $profile) {
      ...Profile
    }
  }
  ${ProfileFragment}
`;

export const useProfileQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const profile = useLazyQuery(PROFILE_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });

  const create = useMutation(CREATE_PROFILE, { onError });
  const update = useMutation(UPDATE_PROFILE, { onError });

  return {
    page: profile[0],
    create: create[0],
    update: update[0]
  };
};

export const findOneProfileAsync = async (_id: string, token: string) => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(FIND_PROFILE, { profile: { userId: _id } })
    .then((res: any) => {
      return res?.findOneProfile;
    }).catch((error: any) => {
      console.error('findOneProfileAsync', error);
      throw error;
    });
};
