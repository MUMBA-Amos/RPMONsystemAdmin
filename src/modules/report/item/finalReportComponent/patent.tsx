import { ApButton, ApModal } from '@/components';
import ApTable, { ApViewDetailBtn } from '@/components/table';
import { CreateFinalReportPatent } from '@/modules/patent/component/create';
import { IPatent, IPublication } from '@/modules/publication/model';
import { useState } from 'react';

interface IProps {
  patents?: IPatent[];
  applicationId?: string;
  reportId?: string;
}

export default function FinalReportPatent({ applicationId, patents, reportId }: IProps) {
  const [modal, setModal] = useState<any>();

  const columns: any = [
    { title: 'Patent No', dataIndex: 'patentNo', key: 'patentNo' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate' },

    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Inventor', dataIndex: 'inventor', key: 'inventor' },
    {
      title: 'Attachment',
      key: 'attachment',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApViewDetailBtn href="" title="View" onClick={() => {}} />
        </div>
      )
    }
  ];
  const handleDissmiss = () => {
    setModal({ show: false });
  };

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Final Patent</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable columns={columns} dataSource={patents} />
      </div>
      <ApModal
        width={700}
        title="Add Final Report Patent"
        show={modal?.show}
        onDimiss={handleDissmiss}
      >
        <CreateFinalReportPatent patent={modal?.data} onDissmiss={handleDissmiss} />
      </ApModal>
    </div>
  );
}
