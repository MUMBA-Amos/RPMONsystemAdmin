import { OrganizationFragment } from '@/modules/organization/gql/fragment';
import { AccessGroupFragment } from '@/modules/permission/group/gql/fragment';
import gql from 'graphql-tag';

export const InviteFragment = gql`
  fragment Invite on Invite {
    _id
    email
    name
    organizationId
    groupId
    createdAt
    organization {
      ...Organization
    }
    group {
      ...AccessGroup
      sections
    }
   
  }
  ${OrganizationFragment}
  ${AccessGroupFragment}
`;
