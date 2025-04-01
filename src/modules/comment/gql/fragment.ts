import gql from 'graphql-tag';
import { UserFragment } from '@/modules/user/gql/fragment';

export const CommentFragment = gql`
  fragment Comment on Comment {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    canUpdate
    canDelete
    comment
    userId
    parentId
    refId
    propName
    user {
      ...User
    }
  }
  ${UserFragment}
`;
