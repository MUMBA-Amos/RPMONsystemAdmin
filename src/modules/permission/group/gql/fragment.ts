import gql from "graphql-tag";
import { PermissionModuleFragment } from "../../gql/fragment";

export const AccessGroupFragment = gql`
  fragment AccessGroup on AccessGroup  {
    _id
    group
    usersCount
    createdAt
    updatedAt
    # module {
    #   ...PermissionModule
    # }
  }
`;
