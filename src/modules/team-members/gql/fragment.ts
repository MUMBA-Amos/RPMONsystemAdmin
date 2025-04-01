import { CommentFragment } from '@/modules/comment/gql/fragment';
import { MasterFragment } from '@/modules/master/gql/fragment';
import gql from 'graphql-tag';

export const TeamMemberFragment = gql`
  fragment TeamMember on TeamMember {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    name
    # email
    # userId
    roleId
    applicationId
    # user {
    #   _id
    #   lastName
    #   firstName
    # }
    comments{
      ...Comment
    }
    role {
      ...Master
    }
  }
  ${MasterFragment}
  ${CommentFragment}
`;
