import gql from 'graphql-tag';

export const WorkExperienceFragment = gql`
  fragment WorkExperience on WorkExperience {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    canUpdate
    canDelete
    researcherId
    role
    description
    institutionId
    institutionName
  }
`;
