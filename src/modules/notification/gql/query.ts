import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { toastSvc } from "../../../services";
import { NotificationFragment } from "./fragment";

const NOTIFICATION_PAGE = gql`
  query notificationPage($page: NotificationPageInput!) {
    notificationPage(page: $page){
      totalRecords,
      data{...Notification}
    }
  }
  ${NotificationFragment}
`;

// const UPDATE_NOTIFICATION_AS_READ = gql`
//   mutation updateNotificationsAsRead() {
//     updateNotificationsAsRead
//   }
// `;

const UPDATE_NOTIFICATION = gql`
  mutation updateNotificationStatus($notificationId: String!, $status: String!) {
    updateNotificationStatus(notificationId: $notificationId, status: $status)
  }
`;

export const useNotificationQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const fetchNotification = useLazyQuery(NOTIFICATION_PAGE, {
    fetchPolicy: "no-cache",
    onError,
  });
  const updateNotificationStatus = useMutation(UPDATE_NOTIFICATION, {
    onError,
  });

  return {
    updateNotificationStatus,
    fetchNotification,
    loading: updateNotificationStatus[1].loading || fetchNotification[1].loading
  };
};
