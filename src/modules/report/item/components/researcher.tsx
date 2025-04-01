import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreateResearcher } from '@/modules/researcher/components/create';
import { useResearcherState } from '@/modules/researcher/context';
import { IResearcher } from '@/modules/researcher/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';
import { TableColumnsType } from 'antd';
import { CreateWorkExperience } from '@/modules/work-experience/components/create';
import { useWorkExperienceState } from '@/modules/work-experience/context';

interface IProps {
  researchers: IResearcher[];
  reportId: string;
}

export default function ReportResearchers({ researchers, reportId }: IProps) {
  const { removeResearcher } = useResearcherState();
  const { removeWorkExperience } = useWorkExperienceState();
  const { fetchReport, filter } = useReportState();
  const [modal, setModal] = useState<any>();
  const [expmodal, setExpModal] = useState<any>();

  const handleDelete = (id: string) => {
    removeResearcher(id).then(() => {
      fetchReport(filter, true);
    });
  };

  const handleDeleteExp = (id: string) => {
    removeWorkExperience(id).then(() => {
      fetchReport(filter, true);
    });
  };

  const columns: any = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Study Level', dataIndex: 'studyLevel', key: 'studyLevel' },
    { title: 'Nationality', dataIndex: 'nationality', key: 'nationality' },
    { title: 'Study Status', dataIndex: 'studyStatus', key: 'studyStatus' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon
            onClick={() => setModal({ data: record, show: true, type: 'update' })}
            tooltipTitle="Edit Researcher"
          />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record._id)}
            tooltipTitle="Delete Researcher"
          />
          <button
            onClick={() => setExpModal({ show: true, type: 'create', researcherId: record?._id })}
            className="text-sm text-primary"
          >
            Add Experience
          </button>
        </div>
      )
    }
  ];

  const expandColumns: TableColumnsType<any> = [
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Institution Name', dataIndex: 'institutionName', key: 'institutionName' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon
            onClick={() => setExpModal({ data: record, show: true, type: 'update', researcherId: record?.researcherId })}
            tooltipTitle="Edit Researcher"
          />
          <ApDeleteRowIcon
            onConfirm={() => handleDeleteExp(record._id)}
            tooltipTitle="Delete Researcher"
          />
        </div>
      )
    }
  ];

  const expandedRowRender = (researcher: IResearcher) => (
    <ApTable columns={expandColumns} dataSource={researcher?.expriences} pagination={false} />
  );

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Students</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable
          expandable={{ expandedRowRender }}
          columns={columns}
          dataSource={researchers}
        />
      </div>

      <ApModal
        title={modal?.type === 'create' ? 'Add Student' : 'Update Student'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateResearcher
          reportId={reportId}
          researcher={modal?.data}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>

      <ApModal
        width={700}
        title={expmodal?.type === 'create' ? 'Add Work Experience' : 'Update  Work Experience'}
        onDimiss={() => setExpModal({ show: false })}
        show={expmodal?.show}
      >
        <CreateWorkExperience
          reportId={reportId}
          researcherId={expmodal?.researcherId}
          workExperience={expmodal?.data}
          onDissmiss={() => setExpModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
