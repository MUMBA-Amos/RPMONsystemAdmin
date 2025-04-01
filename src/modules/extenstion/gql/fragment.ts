import { ReviewerFragment } from '@/modules/reviewer/gql/fragment';
import gql from 'graphql-tag';

export const ExtenstionFragment = gql`
  fragment Extenstion on Extenstion {
    _id
    ref
    status
    applicationId
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    canUpdate
    canDelete
    hasExtenstion
    reportId
    duration
    justification
    workplan
    deviationReason
    remedialAction
    showReviewers
    extensionStatuses
    reviewers{
      ...Reviewer
    }
  }
  ${ReviewerFragment}
`;
