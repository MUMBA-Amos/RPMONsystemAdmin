import { useSession } from "next-auth/react";
import { MdNotifications } from "react-icons/md";

export const NotificationIcon = () => {
  const { data: session } = useSession();

  return (
    <>
      <div>
        <MdNotifications cursor="pointer" size="30" className="text-cyan-500" />
        <div
          className={
            "w-auto h-5 rounded-full absolute -top-2 bg-red-500 px-1.5 pb-2 text-white"
          }
        >
          {/* {dashBoardSummary?.notifications || 0}  */}
        </div>
      </div>
    </>
  );
};
