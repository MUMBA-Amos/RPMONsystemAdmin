import { ActivityFragment } from '@/modules/activity/gql/fragment';
import { BudgetFragment } from '@/modules/budget/gql/fragment';
import { ExpenseFragment } from '@/modules/expenses/gql/fragment';
import { ExtenstionFragment } from '@/modules/extenstion/gql/fragment';
import { PublicationFragment } from '@/modules/publication/gql/fragment';
import { ResearchFragment } from '@/modules/research/gql/fragment';
import { ResearcherFragment } from '@/modules/researcher/gql/fragment';
import { ReviewerFragment } from '@/modules/reviewer/gql/fragment';
import { SignoffFragment } from '@/modules/signoff/gql/fragment';
import gql from 'graphql-tag';

export const ReportFragment = gql`
  fragment Report on Report {
    _id
    ref
    isFinal
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    canUpdate
    canDelete
    title
    description
    applicationId
    fromDate
    toDate
    researchSummary
    projectOverview
    futureResearchDescription
    researchCollaboration
    showApproval
    showEndorsement
    research {
      ...Research
    }
    activities {
      ...Activity
    }
    researchers {
      ...Researcher
    }
    publications {
      ...Publication
    }
    expenses {
      ...Expense
    }
    budgets {
      ...Budget
    }
    signOff {
      ...Signoff
    }
    extension {
      ...Extenstion
    }
    approvers {
      ...Reviewer
    }
    reviewers {
      ...Reviewer
    }
  }
  ${ResearchFragment}
  ${ActivityFragment}
  ${ExtenstionFragment}
  ${PublicationFragment}
  ${ExpenseFragment}
  ${BudgetFragment}
  ${ResearcherFragment}
  ${SignoffFragment}
  ${ReviewerFragment}
`;
