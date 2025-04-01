import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  ApContainer,
  ApButton,
  ApDateRangePicker,
  ApPageTitle,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer,
} from "../../components";
import { useNotificationState } from "./context";
import { INotification, INotificationFilter } from "./model";
import ApTable from "../../components/table";
import { IoMdNotifications } from "react-icons/io";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const NotificationPage = () => {
  const {
    fetchNotification,
    updateNotificationStatus,
    loading,
    notifications,
    totalRecords,
  } = useNotificationState();

  const [filter, setFilter] = useState<INotificationFilter>({
    page: 1,
    pageSize: 50,
  });

  const { data: session } = useSession();
  const user = session as any;
  const [color, setColor] = useState("");
  useEffect(() => {
    fetchNotification({ ...filter, page: filter.page });
  }, [filter]);

  const handleMarkAsRead = (notification: INotification) => {
    if (notification?.status === "READ") {
      updateNotificationStatus(notification?._id, "UNREAD");
      setColor("bg-primary");
    } else
      updateNotificationStatus(notification?._id, "READ"),
        setColor("bg-red-400");
  };
  const handleClearSearch = () => {
    const flt = {
      ...filter,
      fromDate: undefined,
      toDate: undefined,
      keyword: "",
    };
    setFilter(flt);
    fetchNotification(flt);
  };
  // handleDateChange
  const handleDateChange = () => {};

  const columns: any = [
    {
      title: "Title",
      dataIndex: "title",
      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.title}</p>
          </div>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.message}</p>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.status}</p>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.type}</p>
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "right",
      fixed: "right",
      render: (_: any, records: INotification) => {
        return (
          <div className="flex items-end justify-end gap-4">
            <Link
              href={
                records.type == "ORDER"
                  ? `/order/${records.ref}`
                  : `/scheme/user/${records.userId}`
              }
              className="text-primary font-bold"
            >
            <div className="flex items-center">
             <p className="text-primary font">View Detail</p>
              <FaArrowRight size={15} className="ml-2 text-2xl cursor-pointer text-primary"/>
             </div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <ApPageTitle title="Notifications" />

      <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
        <ApSummaryCard
          value={totalRecords}
          title="Total Notifications"
          // subTitle="+2 this week"
          icon={<IoMdNotifications color="#b6b30d" size={20} />}
        />
      </ApSummaryContainer>

      <ApContainer>
        <div className="flex justify-between items-center border-b-2 pb-2 mb-5">
          <div className="flex h-full w-full gap-3 items-center cus-sm2:grid cus-sm2:grid-cols-2">
            <ApSearchInput
              label="Search by (Status,Title)"
              placeholder="Search"
              containerClassName="cus-sm2:w-full cus-xs:col-span-2"
              value={filter.keyword}
              onSearchChange={(val) => setFilter({ ...filter, keyword: val })}
            />

            <ApDateRangePicker
              fromLabel="From Date"
              toLabel="To Date"
              containerClassName="cus-sm2:w-full cus-xs:col-span-2"
              date={{
                fromDate: filter ? new Date() : undefined,
                toDate: filter ? new Date() : undefined,
              }}
              onChange={handleDateChange}
            />

            <ApButton
              title="Clear"
              btnType="outline"
              onClick={handleClearSearch}
              className="!h-11 cus-sm2:!h-[40px] mt-6 cus-sm2:mt-0"
            />
            <ApButton title="Search" className="!h-11 cus-sm2:!h-[40px] mt-6 cus-sm2:mt-0" />
          </div>
        </div>

        <ApTable
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={notifications}
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: filter.pageSize,
            current: filter.page,
            total: totalRecords,
            onChange(page, pageSize) {
              setFilter({
                ...filter,
                page: pageSize !== filter.pageSize ? 1 : page,
                pageSize,
              });
            },
          }}
          loading={loading}
        />
      </ApContainer>
    </div>
  );
};
