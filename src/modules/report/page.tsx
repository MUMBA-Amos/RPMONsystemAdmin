import React, { useEffect } from 'react';
import { useReportState } from './context';
import {
  ApBodyContainer,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '@/components';
import { BsHeadphones } from 'react-icons/bs';
import ApTable, { ApDeleteRowIcon, ApViewDetailBtn } from '@/components/table';
import { ColumnsType } from 'antd/es/table';
import { IReport } from './model';

export const ReportPage = () => {
  const { deleteReport, fetchReport, reports, totalRecords, loading, filter, setFilter } =
    useReportState();

  useEffect(() => {
    fetchReport(filter);
  }, [filter]);

  const columns: ColumnsType<IReport> = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: 'Application Proposal Title',
      key: 'proposalTitle',
      dataIndex: ['research', 'application', 'proposalTitle']
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (record?.research?.applicationId &&
        <div className="flex space-x-2 items-center justify-end">
          <ApDeleteRowIcon onConfirm={() => deleteReport(record._id)} tooltipTitle="Delete Batch" />
          <ApViewDetailBtn href={`/applications/${record?.applicationId}`} />
        </div>
      )
    }
  ];

  return (
    <>
      <ApPageHeader title="Report" />

      <ApBodyContainer className="">
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Reportes"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>

        <div className="flex items-end justify-start gap-3">
          <ApSearchInput
            placeholder="Search Report"
            containerClassName="!w-72"
            value={filter.keyword}
            onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
          />
        </div>

        <ApTable columns={columns} dataSource={reports} loading={loading} />
      </ApBodyContainer>
    </>
  );
};
