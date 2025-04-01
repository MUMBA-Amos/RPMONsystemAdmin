import { ApButton, ApModal, ApText, IModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreateActivity } from '@/modules/activity/components/create';
import { useActivityState } from '@/modules/activity/context';
import { ActivityTypes, IActivity } from '@/modules/activity/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';
import { FaPlus } from 'react-icons/fa6';
import { IReviewer } from '@/modules/reviewer/model';
import CreateReviewers from '@/modules/reviewer/component.tsx/create';
import { useReviewerState } from '@/modules/reviewer/context';
import { IApplication } from '@/modules/application/model';

interface IProps {
  title?: string;
  isApprovers?: boolean;
  reviewers: IReviewer[] | undefined;
  application: IApplication;
}

export default function ReportReviewers({ title = "Reviewers", application, isApprovers, reviewers }: IProps) {

  if (!application.showReviewers) {
    return null;
  }


  const { removeReviewer, setModal, modal } = useReviewerState();

  const columns: any = [
    { title: 'Ref', dataIndex: 'ref', key: 'ref' },
    {
      title: `${isApprovers ? 'Approver' : 'Reviewer'} Name`,
      render: (val: IReviewer) => {
        return <ApText>{val?.reviewer?.firstName}</ApText>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Comment',
      render: (val: IReviewer) => {
        return (
          <ApText>
            {val?.comment?.length > 20 ? val?.comment?.substring(0, 20) : val?.comment}
          </ApText>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: IReviewer) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon
            onClick={() => setModal({ data: record, show: true, type: 'update' })}
            tooltipTitle="Update Reviewers"
          />

          <ApDeleteRowIcon
            onConfirm={() => removeReviewer(record._id)}
            tooltipTitle="Remove Reviewer"
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>{title}</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' } as any)}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable columns={columns} dataSource={reviewers} />
      </div>

      <ApModal
        width={700}
        title={modal?.type === 'create' ? `Add Reviewers` : `Update Reviewers`}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateReviewers
          modal={modal?.data}
          applicationId={application?._id}
          onDismiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
