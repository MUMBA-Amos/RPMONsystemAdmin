import gql from "graphql-tag";

export const MasterFragment = gql`
  fragment Master on Master {
    _id
    name
    key
    parentId
    createdAt
    updatedAt
    image {
      _id
      uri
      type
    }
    categoryList {
      _id
      name
    }
  }
`;
