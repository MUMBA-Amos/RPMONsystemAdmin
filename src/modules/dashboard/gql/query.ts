import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { DashboardReportFragment } from './fragment';
import { toastSvc } from '@/services';

const DASHBOARD_REPORT = gql`
  query dashboardReport {
    dashboardReport {
      ...DashboardReport
    }
  }
  ${DashboardReportFragment}
`;

export const useDashboardQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const dashboardReportQ = useLazyQuery(DASHBOARD_REPORT, { fetchPolicy: 'no-cache', onError });

  return {
    dashboardReportQ: dashboardReportQ[0],
  };
};
