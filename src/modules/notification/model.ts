export interface INotification {
  _id: string;
  ref?: string;
  title: string;
  message: string;
  status: NotificationStatus;
  type: string;
  refId: string;
  userId: string;
}

export enum NotificationStatus {
  READ = "READ",
  UNREAD = "UNREAD",
}

export interface INotificationFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  type?: string;
}

// export interface INotification{
//   _id: String,
// userId: String,
// refId: String,
// type: NotificationType,
// status: NotificationStatusType!
// title: String!
// message: String!
// group: [String!]
// createdAt: String!
// updatedAt: Float
// }


