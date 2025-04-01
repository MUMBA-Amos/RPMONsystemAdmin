import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreatePublication } from '@/modules/publication/components/create';
import { usePublicationState } from '@/modules/publication/context';
import { IPublication } from '@/modules/publication/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';
import { IActivity } from '@/modules/activity/model';
import GrantApplicationMilestones, {
  AddForm
} from '@/modules/application/create/components/milestones';

interface IProps {
  mileStone?: any[];
  applicationId: string;
  reportId?: string;
}

export default function FinalReportMilestone({ applicationId, mileStone, reportId }: IProps) {
  const [modal, setModal] = useState<any>();
  console.log({ mileStone });
  const columns: any = [
    {
      title: 'Milestone ',
      dataIndex: 'milestone',
      key: 'milestone'
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ];
  const handleDismiss = () => {
    setModal({ show: false });
  };
  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Final Milestone</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable columns={columns} dataSource={mileStone} />
      </div>

      <ApModal
        width={700}
        title={
          modal?.type === 'create' ? 'Add Final Report Milestone' : 'Update Final Report Milestone'
        }
        onDimiss={handleDismiss}
        show={modal?.show}
      >
        <AddForm
          applicationId={applicationId}
          parentId={reportId}
          type={'MILESTONE'}
          onNext={handleDismiss}
        />
      </ApModal>
    </div>
  );
}
