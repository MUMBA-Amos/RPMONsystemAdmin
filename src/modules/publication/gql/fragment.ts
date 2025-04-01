import { CommentFragment } from '@/modules/comment/gql/fragment';
import gql from 'graphql-tag';

export const PublicationFragment = gql`
  fragment Publication on Publication {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    title
    tierId
    applicationId
    reportId
    paperTypeId
    status
    year
    doi
    url
    submittedTo
    comments{
      ...Comment
    }
    paperType {
      _id
      name
    }
    tier {
      _id
      name
    }
  }

  ${CommentFragment}
`;
