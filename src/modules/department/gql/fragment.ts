import { UserFragment } from '@/modules/profile/gql/fragment';
import { gql } from 'graphql-tag';

export const DepartmentFragment = gql`
  fragment Department on Department {
    _id
    name
    hodId
    createdAt
    hod {
      ...User
    }
  }
  ${UserFragment}
`;
