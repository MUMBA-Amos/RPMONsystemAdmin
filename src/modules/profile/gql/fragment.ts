import gql from 'graphql-tag';

export const ProfileFragment = gql`
  fragment Profile on Profile {
    _id
    user {
      titleId
      genderId
      nationalityId
      idNumber
      idTypeId
      firstName
      lastName
      username
      name
      email
      phoneNumber
      dateOfBirth
      idType{
        _id
        name
      }
      title{
        _id
        name
      }
      gender{
        _id
        name
      }
      nationality{
        _id
        name
      }
    }
    invitationId
    officeNumber
    residenceStatusId
    organizationId
    designationId
    researchClusterIds
    researchClusters{
      _id
      name
    }
    residenceStatus {
      _id
      name
    }
    designation {
      _id
      name
    }
    organization {
      _id
      name
    }
    sections {
      name
      role
      contractType{
        _id
        name
      }
      institution
      qualification
      fieldOfStudy
      description
      fromDate
      toDate
      kind
    }
  }
`;
