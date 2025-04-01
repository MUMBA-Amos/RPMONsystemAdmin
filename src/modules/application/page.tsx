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
import { useApplicationState } from './context';
import type { IApplication } from './model';
import { useRouter } from 'next/router';

export const ApplicationsPage: React.FC = () => {
  const { setFilter, filter, applications, fetchApplications, loading, totalRecords, removeApplication } =
    useApplicationState();
  const router = useRouter()

  useEffect(() => {
    fetchApplications(filter);
  }, [filter]);

  const columns: ColumnsType<IApplication> = [
    {
      title: 'No.',
      key: 'index',
      render: (_, __, index) => (filter.page - 1) * filter.pageSize + index + 1
    },
    {
      title: 'Researcher',
      dataIndex: ['researcher', 'user', 'name'],
      key: 'proposalTitle'
    },
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
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (val: any) => moment(val).format(AP_DATE_FORMAT)
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon onClick={() => router?.push(`/applications/${record._id}/edit`)} tooltipTitle="Edit Application" />
          <ApDeleteRowIcon onConfirm={() => removeApplication(record._id)} tooltipTitle="Delete Application" />
          <ApViewDetailBtn href={`/applications/${record._id}`} />
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
      <ApPageHeader title="Applications" right={

        <div className='flex gap-4'>
          <ApDateRangePicker
            containerClassName=''
            date={{
              fromDate: filter.fromDate,
              toDate: filter.toDate
            }} onChange={handleDateChange} />

          {/* <ApButton className="rounded-md" onClick={handleCreateApplication} btnType="primary">
            Create Application <FaPlus size={20} className="text-white" />
          </ApButton> */}
        </div>

      } />
      <ApBodyContainer>

        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Applications"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-5 gap-5 h-full w-full items-center">
            <ApSearchInput
              label="Search"
              placeholder="Search Application"
              value={filter.keyword}
              onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
            />

          </div>
          <ApTable
            columns={columns}
            dataSource={applications}
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
    </>
  );
};
