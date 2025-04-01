import { onError } from '@apollo/link-error';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { ReportFragment } from './fragment';
import { toastSvc } from '@/services';
import { getGqlClient } from '@/ApolloClient';

const REPORT_PAGE = gql`
  query reportPage($page: ReportPageInput!) {
    reportPage(page: $page) {
      totalRecords
      data {
        ...Report
      }
    }
  }
  ${ReportFragment}
`;

const START_FINAL_REPORT = gql`
  query startFinalReport($report: CreateReportInput!) {
    startFinalReport(report: $report) {
      ...Report
    }
  }
  ${ReportFragment}
`;

const FIND_FINAL_REPORT = gql`
  query findFinalReport($report: ReportQueryInput!) {
    findFinalReport(report: $report) {
      ...Report
    }
  }
  ${ReportFragment}
`;

const CREATE_REPORT = gql`
  mutation createReport($report: CreateReportInput!) {
    createReport(report: $report) {
      ...Report
    }
  }
  ${ReportFragment}
`;

const UPDATE_REPORT = gql`
  mutation updateReport($_id: String!, $report: UpdateReportInput!) {
    updateReport(_id: $_id, report: $report) {
      ...Report
    }
  }
  ${ReportFragment}
`;

const DELETE_REPORT = gql`
  mutation deleteReport($_id: String!) {
    deleteReport(_id: $_id)
  }
`;

const FIND_REPORT = gql`
  query findOneReport($report: ReportQueryInput!) {
    findOneReport(report: $report) {
      ...Report
    }
  }
  ${ReportFragment}
`;

export const findReportAsync = async (_id: string, token?: string) => {
  const gqlClient = getGqlClient();

  return (
    gqlClient
      // .setHeader("Authorization", `Bearer ${token}`)
      .request(FIND_REPORT, { report: { _id } })
      .then((res: any) => {
        return res.findOneReport;
      })
  );
};

export const useReportQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(REPORT_PAGE, { fetchPolicy: 'no-cache', onError });
  const create = useMutation(CREATE_REPORT, { onError });
  const update = useMutation(UPDATE_REPORT, { onError });
  const remove = useMutation(DELETE_REPORT, { onError });
  const startFinalReport = useLazyQuery(START_FINAL_REPORT, { fetchPolicy: 'no-cache', onError });
  const findFinalReport = useLazyQuery(FIND_FINAL_REPORT, { fetchPolicy: 'no-cache', onError });

  return {
    page: page[0],
    create: create[0],
    update: update[0],
    remove: remove[0],
    startFinalReport: startFinalReport[0],
    findFinalReport: findFinalReport[0]
  };
};

export const findFinalReportAsync = async (applicationId: string, token: string) => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(FIND_FINAL_REPORT, { report: { applicationId } })
    .then((res: any) => {
      return res?.findFinalReport;
    })
    .catch((error: any) => {
      console.error(`findFinalReportAsync:`, JSON.stringify(error, null, 2));
    });
};
