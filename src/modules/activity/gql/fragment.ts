import { CommentFragment } from '@/modules/comment/gql/fragment';
import gql from 'graphql-tag';

export const ActivityFragment = gql`
  fragment Activity on Activity {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    percentage
    type
    parentId
    applicationId
    name
    fromDate
    toDate
    description
    comments{
      ...Comment
    }
  }
  ${CommentFragment}
`;
