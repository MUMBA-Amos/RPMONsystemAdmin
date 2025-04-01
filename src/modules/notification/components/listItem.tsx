import { useRouter } from "next/router";
import React from "react";
import { MdNotifications } from "react-icons/md";
import { ApButton } from "../../../components";
import { INotification } from "../model";

interface IProps {
  notification: INotification;
  onMarkAsRead: (notification: INotification) => void;
  color?: string;
}

export const NotificationlistItem: React.FC<IProps> = ({
  notification,
  onMarkAsRead,
  color,
}) => {
  // const { handleSetNotificationRef } = useOrderState();
  const router = useRouter();

  const handleRedirect = () => {
    // handleSetNotificationRef(notification.ref);
    router.push("/order");
  };

  return (
    <div className="bg-white w-full 2xl:py-[1rem] py-1 px-4 flex items-center justify-between">
      <div className="flex gap-4" onClick={handleRedirect}>
        <MdNotifications size={40} className="text-sky-500" />
        <div>
          <p className="font-bold">{notification.title}</p>
          <p className="w-[40rem]">{notification.message}</p>
        </div>
      </div>
      <ApButton
        title={
          notification?.status === "READ" ? "Mark as unread" : "Mark as read"
        }
        className={
          notification?.status === "READ"
            ? "bg-sky-500 text-white"
            : "bg-red-400 text-white"
        }
        onClick={() => onMarkAsRead(notification)}
      />
      <ApButton
        title="Go to Order"
        className="bg-sky-500 text-white"
        onClick={() => handleRedirect()}
      />
    </div>
  );
};
