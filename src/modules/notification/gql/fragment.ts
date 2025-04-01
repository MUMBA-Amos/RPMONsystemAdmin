import gql from 'graphql-tag';

export const NotificationFragment = gql`
  fragment Notification on Notification {
    _id
    userId
    refId
    title
    ref
    message
    status
    group
    createdAt
    updatedAt
  }
`;
