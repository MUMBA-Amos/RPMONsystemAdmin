import { ActivityFragment } from '@/modules/activity/gql/fragment';
import { CommentFragment } from '@/modules/comment/gql/fragment';
import { ExpenseFragment } from '@/modules/expenses/gql/fragment';
import { ExtenstionFragment } from '@/modules/extenstion/gql/fragment';
import { GrantFragment } from '@/modules/grant/gql/fragment';
import { ProfileFragment } from '@/modules/profile/gql/fragment';
import { PublicationFragment } from '@/modules/publication/gql/fragment';
import { ReportFragment } from '@/modules/report/gql/fragment';
import { ReviewerFragment } from '@/modules/reviewer/gql/fragment';
import gql from 'graphql-tag';

export const ApplicationFragment = gql`
  fragment Application on Application {
    _id
    ref
    organizationId
    createdAt
    updatedBy
    updatedAt
    grantId
    status
    revision
    hasExtension
    researchFocus
    proposalTitle
    executiveSummary
    researchObjective
    expectedOutcome
    rationalAndBackground
    additionalComments
    designAndMethod
    showReviewers
    hasFinalReport
    hasProgressReport
    applicationStatuses
    createdBy
    members {
      _id
      ref
      organizationId
      createdBy
      createdAt
      updatedBy
      updatedAt
      name
      roleId
      applicationId
      role {
        _id
        name
      }
    }
    budgets {
      _id
      applicationId
      year
      voteHeads {
        voteHeadId
        description
        amount
        voteHead {
          _id
          name
          amount
        }
      }
    }
    grant {
      ...Grant
    }
    finalReport{
      ...Report
    }
    reports{
      ...Report
    }
    publications {
     ...Publication
    }
    expenses{
      ...Expense
    }
    extensions{
      ...Extenstion
    }
    activities {
      ...Activity
    }
    reviewers {
     ...Reviewer
    }
    comments {
      ...Comment
    }
    researcher{
      ...Profile
    }
  }
  ${ActivityFragment}
  ${GrantFragment}
  ${ExpenseFragment}
  ${CommentFragment}
  ${PublicationFragment}
  ${ProfileFragment}
  ${ReviewerFragment}
  ${ExtenstionFragment}
  ${ReportFragment}
`;
