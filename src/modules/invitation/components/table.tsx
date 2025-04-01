import React from 'react';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon, ApViewDetailBtn } from '@/components/table';
import { IInvite } from '../model';
import moment from 'moment';
import { AP_DATE_FORMAT } from '@/constants';
import { FaCopy } from 'react-icons/fa6';
import { useInviteState } from '../context';

interface IProps {
  loading?: boolean;
  invites: IInvite[];
}

export const InviteTable: React.FC<IProps> = ({ loading, invites }) => {
  const { removeInvite, setModal } = useInviteState();

  const origin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  const handleCopy = (record: IInvite) => {
    navigator.clipboard.writeText(`${origin}/onboarding/${record._id}`);
  };

  const columns: ColumnsType<IInvite> = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Group',
      key: 'groupId',
      // dataIndex: 'groupId'
      render: (_: any, { group, groupId }) => <p>{group?.group}</p>
    },
    {
      title: 'Organization',
      key: 'organizationId',
      // dataIndex: 'organizationId'
      render: (_: any, { organization }) => <p>{organization?.name}</p>
    },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (_: any, { createdAt }) => <p>{moment(+createdAt).format(AP_DATE_FORMAT)}</p>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex space-x-2 items-center justify-end">
          <Tooltip title="Copy Invite Link">
            <FaCopy
              className="text-primary cursor-pointer mr-2"
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <ApEditRowIcon
            onClick={() => setModal({ show: true, type: 'update', data: record })}
            tooltipTitle="Edit Invite"
          />
          <ApDeleteRowIcon
            onConfirm={() => removeInvite(record._id)}
            tooltipTitle="Delete Invite"
          />
          {/* <ApViewDetailBtn href={`/grants/${record._id}`} /> */}
        </div>
      )
    }
  ];
  return (
    <div>
      <ApTable
        columns={columns}
        dataSource={invites}
        loading={loading}
        className="border rounded-lg outline-none my-2"
      />
    </div>
  );
};
