import React from 'react';
import { ColumnsType } from 'antd/es/table';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon, ApViewDetailBtn } from '@/components/table';
import { IUser } from '../model';
import { AP_DATE_FORMAT } from '@/constants';
import moment from 'moment';

interface IProps {
  loading?: boolean;
  users: IUser[];
}

export const UsersTable: React.FC<IProps> = ({ loading, users }) => {
  const columns: ColumnsType<IUser> = [
    {
      title: 'First Name',
      key: 'firstName',
      dataIndex: 'firstName'
    },
    {
      title: 'Last Name',
      key: 'lastName',
      dataIndex: 'lastName'
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Phone Number',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber'
    },
    {
      title: 'Group',
      key: 'phoneNumber',
      dataIndex: ['group', 'group']
    },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (_: any, { createdAt }) => moment(+createdAt).format(AP_DATE_FORMAT)
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      align: 'right',
      render: (_: any, { _id }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <ApEditRowIcon tooltipTitle="Edit User" onClick={() => {}} />
            <ApDeleteRowIcon tooltipTitle="Delete User" onConfirm={() => {}} />
            <ApViewDetailBtn href={`/users/${_id}`} />
          </div>
        );
      }
    }
  ];
  return (
    <div>
      <ApTable
        columns={columns}
        dataSource={users}
        loading={loading}
        className="border rounded-lg outline-none"
      />
    </div>
  );
};
