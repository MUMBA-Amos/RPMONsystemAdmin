import React from 'react';
import { ColumnsType } from 'antd/es/table';
import ApTable from '@/components/table';
import { IApplication } from '@/modules/application/model';
import moment from 'moment';
import { AP_DATE_FORMAT } from '@/constants';
import { useDashboardState } from '../context';

export const RecentApplications = () => {
  const { dashboardReport } = useDashboardState();

  const columns: ColumnsType<IApplication> = [
    {
      title: 'Proposal Title',
      dataIndex: 'proposalTitle',
      key: 'proposalTitle'
    },
    {
      title: 'Grant',
      dataIndex: 'grant',
      key: 'grant',
      render: (val: any) => val?.name
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (val: any) => moment(val).format(AP_DATE_FORMAT)
    }
  ];

  return (
    <div>
      <h1 className="text-base md:text-[23px]/[34.5px] font-medium pb-4">Applications</h1>
      <ApTable
        columns={columns}
        dataSource={dashboardReport?.applications}
        className="border rounded-lg outline-none my-2"
      />
    </div>
  );
};
