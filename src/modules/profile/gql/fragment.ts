import gql from "graphql-tag";

export const UserFragment = gql`
  fragment User on User {
    _id
    referralId
    idNumber
    username
    name
    kind
    email
    phoneNumber
    active
    roles
    address
    latitude
    longitude
  }
`;
