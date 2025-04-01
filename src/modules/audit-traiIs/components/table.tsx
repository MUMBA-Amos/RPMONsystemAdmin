import ApTable, { ApViewDetailBtn } from '@/components/table';
import { AP_DATE_TIME_FORMAT } from '@/constants';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React from 'react';
import { MdDownload } from 'react-icons/md';
import { useAuditLogState } from '../context';
import { IAuditLog } from '../model';

interface IProps {
  loading?: boolean;
  auditLogs: IAuditLog[];
}

export const AuditLogTable: React.FC<IProps> = () => {
  const { loading, auditLogs } = useAuditLogState();

  const getRoute = (kind: string) => {
    switch (kind) {
      case 'application':
        return 'applications';
      default:
        return '';
    }
  };


  const columns: ColumnsType<IAuditLog> = [
    {
      title: 'Ref',
      dataIndex: 'ref',
    },
    {
      title: 'Module',
      key: 'kind',
      dataIndex: 'kind'
    },
    {
      title: 'Changes',
      key: 'changes',
      dataIndex: 'changes'
    },
    {
      title: 'User Name',
      key: 'user',
      dataIndex: ['user', 'username'],
      render: (name) => name || 'N/A'
    },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (_: any, { createdAt }) => moment(+createdAt).format(AP_DATE_TIME_FORMAT)
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end">
          <ApViewDetailBtn href={`/${getRoute(record.kind)}/${record.refId}`} />
        </div>
      )
    }
  ];
  return (
    <div className="w-full flex flex-col !gap-0">
      <div className="flex justify-between rounded-t-lg bg-primary text-white p-4">
        <div className="md:pl-8">Usage Tracking</div>
        <div className="flex items-center gap-1 cursor-pointer">
          <MdDownload />
          <span>Download</span>
        </div>
      </div>
      <ApTable
        columns={columns}
        dataSource={auditLogs}
        loading={loading}
        className="border rounded-b-lg outline-none"
      />
    </div>
  );
};
