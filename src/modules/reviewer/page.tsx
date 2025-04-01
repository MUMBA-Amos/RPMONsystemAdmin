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
import { useReviewerState } from './context';
import type { IReviewer } from './model';

export const ReviewerPage: React.FC = () => {
  const { setFilter, filter, reviewers, fetchReviewers, loading, totalRecords, removeReviewer } =
    useReviewerState();

  useEffect(() => {
    fetchReviewers(filter);
  }, [filter]);

  const columns: ColumnsType<IReviewer> = [
    {
      title: 'Application Proposal Title',
      dataIndex: 'proposalTitle',
      key: 'proposalTitle',
      render: (val: any, record: IReviewer) => record?.application?.proposalTitle
    },
    {
      title: 'Grant',
      dataIndex: 'grant',
      key: 'grant',
      render: (val: any, record: IReviewer) => record?.application?.grant?.name
    },
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (val: any, record: any) => `${val?.firstName} ${val?.lastName}`
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
      render: (_, record: IReviewer) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApDeleteRowIcon
            onConfirm={() => removeReviewer(record._id)}
            tooltipTitle="Delete Reviewer"
          />
          <ApViewDetailBtn title="View Application" href={`/applications/${record?.application?._id}`} />
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
        title="Nominations"
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
          </div>
        }
      />
      <ApBodyContainer>
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Reviewers"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-5 gap-5 h-full w-full items-center">
            <ApSearchInput
              label="Search"
              placeholder="Search Reviewer"
              value={filter.keyword}
              onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
            />
          </div>
          <ApTable
            columns={columns}
            dataSource={reviewers}
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
