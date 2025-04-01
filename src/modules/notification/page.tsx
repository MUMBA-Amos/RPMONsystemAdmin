import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  ApContainer,
  ApButton,
  ApDateRangePicker,
  ApPageTitle,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '../../components';
import { useNotificationState } from './context';
import { INotification, INotificationFilter } from './model';
import ApTable, { ApViewDetailBtn } from '../../components/table';
import { IoMdNotifications } from 'react-icons/io';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/router';

export const NotificationPage = () => {
  const { fetchNotification, updateNotificationStatus, loading, notifications, totalRecords } =
    useNotificationState();

  const [filter, setFilter] = useState<INotificationFilter>({
    page: 1,
    pageSize: 50
  });

  const { data: session } = useSession();
  const user = session as any;
  const [color, setColor] = useState('');
  useEffect(() => {
    fetchNotification({ ...filter, page: filter.page });
  }, [filter]);

  // const handleMarkAsRead = (notification: INotification) => {
  //   if (notification?.status === 'READ') {
  //     updateNotificationStatus(notification?._id, 'UNREAD');
  //     setColor('bg-primary');
  //   } else updateNotificationStatus(notification?._id, 'READ'), setColor('bg-red-400');
  // };

  const handleViewDetail = async (notification: INotification) => {
    try {
      await updateNotificationStatus(notification?._id, 'READ');
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const handleClearSearch = () => {
    const flt = {
      ...filter,
      fromDate: undefined,
      toDate: undefined,
      keyword: ''
    };
    setFilter(flt);
    fetchNotification(flt);
  };
  // handleDateChange
  const handleDateChange = () => { };

  const columns: any = [
    {
      title: 'Ref',

      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.ref}</p>
          </div>
        );
      }
    },
    {
      title: 'Title',

      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.title}</p>
          </div>
        );
      }
    },

    {
      title: 'Message',

      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.message}</p>
          </div>
        );
      }
    },
    {
      title: 'Status',

      render: (_: any, records: INotification) => {
        return (
          <div className="">
            <p>{records?.status}</p>
          </div>
        );
      }
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, records: INotification) => {
        return (
          <div className="flex space-x-2 justify-end items-center">
            <ApViewDetailBtn href={`/applications/${records.refId}`} onClick={() => handleViewDetail(records)} />
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 px-4 pt-4">
      <ApPageTitle title="Notifications" />

      <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
        <ApSummaryCard
          value={totalRecords}
          title="Total Notifications"
          // subTitle="+2 this week"
          icon={<IoMdNotifications color="#b6b30d" size={20} />}
          className="!w-1/4"
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
                toDate: filter ? new Date() : undefined
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
                pageSize
              });
            }
          }}
          loading={loading}
        />
      </ApContainer>
    </div>
  );
};
