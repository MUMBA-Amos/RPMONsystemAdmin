import React from 'react';
import { ColumnsType } from 'antd/es/table';
import ApTable from '@/components/table';
import { IGrant } from '@/modules/grant/model';
import { useDashboardState } from '../context';

export const RecentGrants = () => {
  const { dashboardReport } = useDashboardState();

  const columns: ColumnsType<IGrant> = [
    {
      title: 'GRANT NAME',
      dataIndex: 'name',
      key: 'name'
    },

    {
      title: 'BATCH',
      dataIndex: 'batchId',
      key: 'batchId',
      render: (_: any, { batch }) => <p>{batch?.name}</p>
    },
    {
      title: 'RESEARCH CLUSTER',
      dataIndex: ['cluster', 'name'],
      key: 'cluster'
    }
  ];

  return (
    <div>
      <h1 className="text-base md:text-[23px]/[34.5px] font-medium pb-4">Grants</h1>
      <ApTable
        columns={columns}
        dataSource={dashboardReport?.grants}
        className="border rounded-lg outline-none my-2"
      />
    </div>
  );
};
