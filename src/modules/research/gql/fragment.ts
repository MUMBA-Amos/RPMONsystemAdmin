import gql from 'graphql-tag';

export const ResearchFragment = gql`
  fragment Research on Research {
    _id
    ref
    organizationId
    createdBy
    createdAt
    updatedBy
    updatedAt
    canUpdate
    canDelete
    version
    applicationId
    reportId
    overview
    methodology
    results
    deviationExplanation
    remedialAction
    requestExtention
    duration
    explanation
    application {
      _id
      proposalTitle
    }
  }
`;
