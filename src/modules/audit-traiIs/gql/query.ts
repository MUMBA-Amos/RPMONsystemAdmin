import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { toastSvc } from '@/services';
import { AuditLogFragment } from './fragment';
import { getGqlClient } from '../../../ApolloClient';

const AuditLog_PAGE = gql`
  query auditLogPage($page: AuditLogPageInput!) {
    auditLogPage(page: $page) {
      totalRecords
      data {
        ...AuditLog
      }
    }
  }
  ${AuditLogFragment}
`;

const FIND_AuditLog = gql`
  query findOneAuditLog($AuditLog: AuditLogQueryInput!) {
    findOneAuditLog(AuditLog: $AuditLog) {
      ...AuditLog
    }
  }
  ${AuditLogFragment}
`;

export const useAuditLogQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const page = useLazyQuery(AuditLog_PAGE, {
    fetchPolicy: 'no-cache',
    onError
  });
  const findOne = useLazyQuery(FIND_AuditLog, { fetchPolicy: 'no-cache', onError });

  return {
    page: page[0],
    findOne: findOne[0]
  };
};

export const findOneAuditLogAsync = async (_id: string) => {
  return await getGqlClient()
    .request(FIND_AuditLog, { AuditLog: { _id } })
    .then((res: any) => {
      return res?.findOneAuditLog;
    });
};
