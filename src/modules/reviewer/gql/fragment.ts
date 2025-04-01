import { CommentFragment } from '@/modules/comment/gql/fragment';
import gql from 'graphql-tag';

export const ReviewerFragment = gql`
  fragment Reviewer on Reviewer {
    _id
    ref 
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    status
    comment
    applicationId
    reviewerId
    reviewer {
      _id
      username
      nickname
      firstName
      lastName
      email
      phoneNumber
    }
    comments{
      ...Comment
    }
  }
  ${CommentFragment}
`;
