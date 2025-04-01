import {
  ApBodyContainer,
  ApButton,
  ApDateRangePicker,
  ApModal,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '@/components';
import ApTable, {
  ApDeleteRowIcon,
  ApEditRowIcon,
  ApViewDetailBtn,
  mapTablePagination
} from '@/components/table';
import { AP_DATE_FORMAT } from '@/constants';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { BsHeadphones } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { CreateGrant } from './components/create';
import { useGrantState } from './context';
import type { IGrant } from './model';

export const GrantPage: React.FC = () => {
  const { setFilter, filter, grants, fetchGrants, loading, totalRecords, removeGrant } =
    useGrantState();
  const [modal, setModal] = useState<{ show: boolean; type?: 'create' | 'update'; data?: any }>({
    show: false,
    type: 'create'
  });

  useEffect(() => {
    fetchGrants(filter);
  }, [filter]);

  const handleEdit = (record: IGrant) => {
    setModal({ show: true, type: 'update', data: record });
  };

  const handleCreateGrant = () => {
    setModal({ show: true, type: 'create' });
  };

  const columns: ColumnsType<IGrant> = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => (filter.page - 1) * filter.pageSize + index + 1
    },
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
    },
    {
      title: 'SCHEME',
      dataIndex: ['scheme', 'name'],
      key: 'scheme'
    },
    {
      title: 'FROM DATE',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (_: any, { fromDate }) => <p>{moment(fromDate).format(AP_DATE_FORMAT)}</p>
    },
    {
      title: 'TO DATE',
      dataIndex: 'toDate',
      key: 'toDate',
      render: (_: any, { toDate }) => <p>{moment(toDate).format(AP_DATE_FORMAT)}</p>
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: any, { createdAt }) => <p>{moment(createdAt).format(AP_DATE_FORMAT)}</p>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon onClick={() => handleEdit(record)} tooltipTitle="Edit Grant" />
          <ApDeleteRowIcon onConfirm={() => removeGrant(record._id)} tooltipTitle="Delete Grant" />
          <ApViewDetailBtn href={`/grants/apply/${record._id}`} />
        </div>
      )
    }
  ];

  const handleTableChange = useCallback(
    (page: number, pageSize: number) => {
      setFilter({ ...filter, page, pageSize });
    },
    [filter, setFilter]
  );

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : undefined;
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : undefined;
    setFilter({ ...filter, fromDate, toDate });
  };

  return (
    <>
      <ApPageHeader
        title="Grants"
        right={
          <div className="flex gap-4">
            <ApDateRangePicker
              containerClassName=""
              date={{
                fromDate: filter.fromDate,
                toDate: filter.toDate
              }}
              onChange={handleDateChange}
            />
            <ApButton className="rounded-md" onClick={handleCreateGrant} btnType="primary">
              Create Grant <FaPlus size={20} className="text-white" />
            </ApButton>
          </div>
        }
      />
      <ApBodyContainer>
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Grants"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-5 gap-5 h-full w-full items-center">
            <ApSearchInput
              label="Search"
              placeholder="Search Grant"
              value={filter.keyword}
              onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
            />
          </div>
          <ApTable
            columns={columns}
            dataSource={grants}
            loading={loading}
            pagination={mapTablePagination({
              filter,
              totalRecords,
              setFilter,
              onChange: handleTableChange
            })}
            className="border rounded-lg outline-none"
          />
        </div>
      </ApBodyContainer>
      <ApModal
        width={700}
        title={modal.type === 'create' ? 'CREATE GRANT' : 'UPDATE GRANT'}
        onDimiss={() => setModal({ show: false })}
        show={modal.show}
      >
        <CreateGrant grant={modal.data} onDissmiss={() => setModal({ show: false })} />
      </ApModal>
    </>
  );
};
