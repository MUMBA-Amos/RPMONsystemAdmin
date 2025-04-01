import { ApplicationFragment } from '@/modules/application/gql/fragment';
import { AuditLogFragment } from '@/modules/audit-traiIs/gql/fragment';
import { GrantFragment } from '@/modules/grant/gql/fragment';
import gql from 'graphql-tag';

export const DashboardReportFragment = gql`
  fragment DashboardReport on DashboardReport  {
    availableGrantsCount
    applicationsCount
    approvedApplicationsCount
    nominationsCount
    endorsementCount
    activities {
      ...AuditLog
    }
    applicationTrends {
      date
      count
    }
    userEngatementTrends {
      date
      count
    }
    applications {
      ...Application
    }
    grants {
      ...Grant
    }
  }
  ${GrantFragment}
  ${ApplicationFragment}
  ${AuditLogFragment}
`;
