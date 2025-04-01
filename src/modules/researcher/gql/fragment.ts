import { WorkExperienceFragment } from '@/modules/work-experience/gql/fragment';
import gql from 'graphql-tag';

export const ResearcherFragment = gql`
  fragment Researcher on Researcher {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    supervisorId
    firstName
    lastName
    studyLevel
    nationality
    studyStatus
    isStudent
    expriences {
      ...WorkExperience
    }
  }
  ${WorkExperienceFragment}
`;
