import gql from 'graphql-tag';

export const UserFragment = gql`
  fragment User on User {
    _id
    email
    phoneNumber
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    ref
    kind
    groupId
    idNumber
    idTypeId
    titleId
    genderId
    username
    nickname
    firstName
    lastName
    nationalityId
    dateOfBirth
    emailVerified
    phoneNumberVerified
    idVerified
    idVerificationStatus
    active
    address
    latitude
    longitude
    group{
      _id
      group
    }
  }
`;
