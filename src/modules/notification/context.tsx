import React, { createContext, useState } from 'react';
import { toastSvc } from '../../services';

import { OperationVariables, QueryResult } from '@apollo/client';
import { useRouter } from 'next/router';
import { useNotificationQuery } from './gql/query';
import { INotification, INotificationFilter } from './model';

interface INotificationState {
  loading: boolean;
  totalRecords: number;
  notificationCounts: number;
  fetchNotification: (page: INotificationFilter) => Promise<QueryResult<any, OperationVariables>>;
  notifications: INotification[];
  updateNotificationStatus: (notificationId: string, status: string) => Promise<void>;
  fetchNotificationCount: () => Promise<void>;
}

const NotificationContext = createContext<INotificationState | undefined>(undefined);

export const useNotificationState = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within the app global provider');
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const NotificationContextProvider: React.FC<IProps> = ({ children }) => {
  const notificationQ = useNotificationQuery();
  const router = useRouter();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [notificationCounts, setNotificationCounts] = useState(0);

  const limit = 5;

  const fetchNotification = (page: INotificationFilter) => {
    let payload: any = {
      skip: page.page === 1 ? 0 : (page.page - 1) * page.pageSize,
      keyword: page?.keyword,
      take: page.pageSize
    };

    return notificationQ.fetchNotification[0]({
      variables: { page: { ...payload } }
    }).then((res) => {
      const data = res?.data?.notificationPage;
      setNotifications(data?.data);
      setTotalRecords(data?.totalRecords);
      return data;
    });
  };

  const fetchNotificationCount = async () => {
    return notificationQ.notificationCount[0]({}).then((res) => {
      const data = res?.data?.notificationCount;
      if (data) {
        setNotificationCounts(data);
      }
      return data;
    });
  };

  const updateNotificationStatus = (notificationId: string, status: any) => {
    return notificationQ.updateNotificationStatus[0]({
      variables: { notificationId, status }
    }).then((res) => {
      const data = res?.data?.updateNotificationStatus;
      if (data) {
        toastSvc.success('Update successful');
        setNotifications(
          notifications.map((n) => (n._id === notificationId ? { ...n, status } : n))
        );
      }
      return data;
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        loading: notificationQ.loading,
        updateNotificationStatus,
        fetchNotification,
        notifications,
        totalRecords,
        fetchNotificationCount,
        notificationCounts
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// interface INotificationState {
//   loading: boolean;
//   totalRecords: number;
//   limit: number;
//   notifications: INotification[];
//   fetchNotificationPage: (
//     page: number,
//     userId: string,
//     keyword?: string
//   ) => void;
//   updateNotifcation: (id: string, status: string) => Promise<void>;
//   markAllNotificationAsRead: () => void;
// }
// const NotificationContext = createContext<INotificationState>({
//   loading: true,
//   totalRecords: 0,
//   limit: 0,
//   notifications: [],
//   fetchNotificationPage(page, userId, keyword) {},
//   updateNotifcation(id, status) {
//     return {} as any;
//   },
//   markAllNotificationAsRead() {},
// });

// export const useNotificationState = () => {
//   const context = React.useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error("app dispatch must be used within the app global provider");
//   }
//   return context;
// };

// interface IProps {
//   children: React.ReactNode;
// }

// export const NotificationContextProvider: React.FC<IProps> = ({ children }) => {
//   const [notifications, setNotifications] = useState<INotification[]>([]);
//   const [skip, setSkip] = useState(0);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit, setLimit] = useState(7);
//   const [color, setColor] = useState("");

//   const [fetchNotifications, { loading }] = useLazyNotificationPage(
//     (res: any) => {
//       setNotifications(res.data);
//       setTotalRecords(res.totalRecords);
//     }
//   );

//   const updateQuery = useUpdateNotificationStatus((res: any) => {
//     toastSvc.success("Notification Updated");
//   });

//   const updateAllQuery = useMarkAllNotification((res: any) => {
//     toastSvc.success("Marked all as read");
//   });

//   const fetchNotificationPage = (
//     skip: number,
//     userId: string,
//     keyword?: string
//   ) => {
//     setSkip(skip);
//     fetchNotifications({
//       variables: {
//         page: { skip: skip, take: limit, accountId: userId, keyword },
//       },
//     });
//   };

//   const updateNotifcation = (id: string, status: string) => {
//     return updateQuery[0]({ variables: { id, status } }).then((res) => {
//       const update = res.data?.updateNotificationStatus;
//       if (update) {
//         setNotifications(
//           notifications.map((n, i) => (n?._id === update?._id ? update : n))
//         );
//       }
//     });
//   };

//   const markAllNotificationAsRead = () => {
//     return updateAllQuery[0]({ variables: {} }).then((res) => {
//       setNotifications(
//         notifications.map((n) => {
//           return { ...n, type: "READ" };
//         })
//       );
//     });
//   };
//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         loading,
//         totalRecords,
//         limit,
//         fetchNotificationPage,
//         updateNotifcation,
//         markAllNotificationAsRead,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };
