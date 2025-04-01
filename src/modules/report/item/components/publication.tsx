import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreatePublication } from '@/modules/publication/components/create';
import { usePublicationState } from '@/modules/publication/context';
import { IPublication } from '@/modules/publication/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';

interface IProps {
  title?: string;
  publications: IPublication[];
  applicationId: string;
  reportId: string;
}

export default function ReportPublication({ applicationId, title, publications, reportId }: IProps) {
  const { removePublication } = usePublicationState();
  const { fetchReport, filter } = useReportState();
  const [modal, setModal] = useState<any>();

  const handleDelete = (id: string) => {
    removePublication(id).then(() => {
      fetchReport(filter, true);
    });
  };

  const columns: any = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Paper Type',
      dataIndex: 'paperType',
      key: 'paperType',
      render: (val: any) => val?.name
    },
    { title: 'Tier', dataIndex: ['tier', 'name'], key: 'tier' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'DOI', dataIndex: 'doi', key: 'doi' },
    { title: 'URL', dataIndex: 'url', key: 'url' },
    { title: 'Submitted To', dataIndex: 'submittedTo', key: 'submittedTo' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon
            onClick={() => setModal({ data: record, show: true, type: 'update' })}
            tooltipTitle="Edit Publication"
          />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record._id)}
            tooltipTitle="Delete Publication"
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>{title || 'Publication'}</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable columns={columns} dataSource={publications} />
      </div>

      <ApModal
        width={700}
        title={modal?.type === 'create' ? 'Add Publication' : 'Update Publication'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreatePublication
          applicationId={applicationId}
          reportId={reportId}
          publication={modal?.data}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
