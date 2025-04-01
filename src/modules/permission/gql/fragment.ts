import gql from "graphql-tag";

export const PermissionActionFragment = gql`
  fragment PermissionAction on PermissionAction {
    _id
    moduleId
    action
    name
    createdAt
    updatedAt
    hasPermission
    module {
        _id
    }
  }
`;

export const PermissionModuleFragment = gql`
  fragment PermissionModule on PermissionModule {
    _id
    # moduleId
    actions {
        ...PermissionAction
    }
    name
    createdAt
    updatedAt
  }
  ${PermissionActionFragment}
`;
