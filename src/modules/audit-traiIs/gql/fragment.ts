import gql from 'graphql-tag';
import { UserFragment } from '@/modules/user/gql/fragment';

export const AuditLogFragment = gql`
  fragment AuditLog on AuditLog {
    _id
    ref
    refId
    status
    kind
    description
    changes
    message
    createdBy
    createdAt
    user {
      ...User
    }
  }
  ${UserFragment}
`;
