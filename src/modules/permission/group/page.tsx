import React, { useEffect, useState } from 'react';
import {
  ApContainer,
  ApButton,
  ApModal,
  ApPageTitle,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '../../../components';
import ApTable from '../../../components/table';
import { Popconfirm, Tooltip } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { useAccessGroupState } from './context';
import { CreateOrUpdateGroup } from './components';
import { AiFillDelete } from 'react-icons/ai';
import { IAccessGroup } from './model';
import { FaUserGroup } from 'react-icons/fa6';
import Link from 'next/link';

const GroupsPage = () => {
  const { accessGroups, initLoading, findAccessGroups, deleteAccessGroup } = useAccessGroupState();
  const [modal, setModal] = useState<{
    show: boolean;
    data?: any;
    type?: 'Create Group' | 'Update Group';
  }>({
    show: false
  });

  const columns: any = [
    {
      title: 'Group',
      dataIndex: 'group'
    },
    {
      title: <p className="text-right">Actions</p>,
      key: 'actions',
      align: 'right',
      fixed: 'right',
      dataIndex: 'actions',
      render: (_: any, record: IAccessGroup) => {
        return (
          <div className="flex items-end justify-end w-full gap-4 px-1">
            <Popconfirm
              placement="top"
              okButtonProps={{ className: 'bg-primary' }}
              title={'Delete Group'}
              onConfirm={() => deleteAccessGroup(record)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip placement="top" title="Delete">
                <AiFillDelete className="text-xl text-red-500" />
              </Tooltip>
            </Popconfirm>

            <Tooltip placement="top" title="Edit" className="cursor-pointer">
              <FaEdit
                className="text-xl text-blue-400"
                onClick={() => setModal({ show: true, type: 'Update Group', data: record })}
              />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    findAccessGroups({});
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <ApSummaryContainer className="flex items-end justify-end">
        <ApButton
          className="h-11 w-full max-w-[150px] !px-2"
          onClick={() => setModal({ show: true, type: 'Create Group' })}
          title="New Group"
        />
      </ApSummaryContainer>

      <ApContainer className="!h-full mt-5">
        <ApTable
          scroll={{ y: 500 }}
          columns={columns}
          dataSource={accessGroups}
          pagination={false}
          loading={initLoading}
        />
      </ApContainer>

      <ApModal
        title={modal?.type}
        show={modal.show}
        width={'600px'}
        onDimiss={() => setModal({ show: false })}
      >
        <CreateOrUpdateGroup
          onDismiss={() => setModal({ show: false })}
          type={modal?.type}
          group={modal?.data}
        />
      </ApModal>
    </div>
  );
};

export default GroupsPage;
