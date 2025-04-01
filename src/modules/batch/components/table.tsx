import React from 'react';
import { ColumnsType } from 'antd/es/table';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon, ApViewDetailBtn } from '@/components/table';
import { IBatch } from '../model';
import { useBatchState } from '../context';

interface IProps {
  loading?: boolean;
  batches: IBatch[];
}

export const BatchTable: React.FC<IProps> = ({ loading, batches }) => {
  const { deleteBatch, setModal } = useBatchState();

  const columns: ColumnsType<IBatch> = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description'
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex space-x-2 items-center justify-end">
          <ApEditRowIcon
            onClick={() => setModal({ show: true, type: 'update', data: record })}
            tooltipTitle="Edit Batch"
          />
          <ApDeleteRowIcon onConfirm={() => deleteBatch(record._id)} tooltipTitle="Delete Batch" />
          {/* <ApViewDetailBtn href={`/batches/${record._id}`} /> */}
        </div>
      )
    }
  ];
  return (
    <div>
      <ApTable
        columns={columns}
        dataSource={batches}
        loading={loading}
        className="border rounded-lg outline-none my-2"
      />
    </div>
  );
};
