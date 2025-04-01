import React from 'react';
import { ColumnsType } from 'antd/es/table';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { IVoteHead } from '../model';
import { useVoteHeadState } from '../context';
import moment from 'moment';
import { AP_DATE_FORMAT } from '@/constants';

interface IProps {
  loading?: boolean;
  voteHeads: IVoteHead[];
}

export const VoteHeadTable: React.FC<IProps> = ({ loading, voteHeads }) => {
  const { removeVoteHead, setModal } = useVoteHeadState();

  const columns: ColumnsType<IVoteHead> = [
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
      title: 'Amount',
      key: 'amount',
      dataIndex: 'amount'
    },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (_: any, { createdAt }) => moment(+createdAt).format(AP_DATE_FORMAT)
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex space-x-2 items-center justify-end">
          <ApEditRowIcon
            onClick={() => setModal({ show: true, type: 'update', data: record })}
            tooltipTitle="Edit VoteHead"
          />
          <ApDeleteRowIcon
            onConfirm={() => removeVoteHead(record._id)}
            tooltipTitle="Delete VoteHead"
          />
        </div>
      )
    }
  ];
  return (
    <div>
      <ApTable
        columns={columns}
        dataSource={voteHeads}
        loading={loading}
        className="border rounded-lg outline-none my-2"
      />
    </div>
  );
};
