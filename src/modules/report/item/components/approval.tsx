import { ApButton, ApText } from '@/components';
import ApTable from '@/components/table';
import { IReviewer } from '@/modules/reviewer/model';
import { useState } from 'react';

interface IProps {
  approval: any[] | undefined;
}

export default function ReportApprovers({ approval }: IProps) {
  const [modal, setModal] = useState<any>();

  const columns: any = [
    { title: 'Ref', dataIndex: 'ref', key: 'ref' },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (val: IReviewer) => {
        return (
          <ApText>{val?.comment.length > 20 ? val.comment.substring(0, 20) : val.comment}</ApText>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Reviewer Name',
      render: (val: IReviewer) => {
        return <ApText>{val?.reviewer?.name}</ApText>;
      }
    }
  ];

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Approval</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' } as any)}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable columns={columns} dataSource={approval} />
      </div>
    </div>
  );
}

const ApprovalItem = ({ item }: { item: IReviewer }) => {
  return (
    <div className="border p-3 rounded-lg">
      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className="font-medium text-primary">Ref</p>
          <p className="leading-loose mt-1 text-sm">{item?.ref ?? '---'}</p>
        </div>
        <div>
          <p className="font-medium text-primary">Reviewer Name</p>
          <p className="leading-loose mt-1 text-sm">{item?.reviewer?.name ?? '---'}</p>
        </div>
        <div>
          <p className="font-medium text-primary">Reviewer Email</p>
          <p className="leading-loose mt-1 text-sm">{item?.reviewer?.email ?? '---'}</p>
        </div>
        <div>
          <p className="font-medium text-primary">Reviewer Comment</p>
          <p className="leading-loose mt-1 text-sm">{item?.comment ?? '---'}</p>
        </div>
      </div>
    </div>
  );
};
