import gql from 'graphql-tag';

export const SignoffFragment = gql`
  fragment Signoff on Signoff {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    canUpdate
    canDelete
    applicationId
    versionId
    userId
    projectId
    proposalTittle
    investigators
    agency
    address
    executiveSummary
    projectStatus
    projectStatusExplanation
    researcherSignature
    researcherSignDate
    institutionName
    institutionAddress
    telephone
    email
    departmentHeadSignature
    departmentHeadSignDate
    application {
      _id
    }
  }
`;
